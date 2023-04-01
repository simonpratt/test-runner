import { prisma } from './core/prisma.client';
import { rabbitJobPublisher, rabbitWSPublisher } from './core/rabbit';

let running = true;

export const stopCommandLoop = () => {
  running = false;
};

const wait = (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};

export interface RunCommandEvent {
  commandId: string;
  dockerImage: string;
  startCommand: string;
  variables: { name: string; value: string }[];
}

const emitCommandRun = async (commandId: string) => {
  const command = await prisma.command.findUnique({
    where: { id: commandId },
    include: { Job: { include: { dockerImageConfig: true, Environment: { include: { EnvironmentVariable: true } } } } },
  });

  if (!command) {
    throw new Error('Command not found');
  }

  const runCommand: RunCommandEvent = {
    commandId: command.id,
    dockerImage: command.Job.dockerImageConfig.dockerImage,
    startCommand: command.Job.dockerImageConfig.startCommand,
    variables: [
      ...(command.Job.Environment?.EnvironmentVariable.map((v) => ({ name: v.name, value: v.value })) || []),
      { name: 'TEST_SPEC', value: command.spec },
    ],
  };
  await rabbitJobPublisher.publish('COMMAND.RUN', runCommand);
};

export const startCommandLoop = async () => {
  while (running) {
    const nextCommand = await prisma.command.findFirst({
      where: { status: 'PENDING' },
    });

    // Claim and emit if there is a command
    if (nextCommand) {
      const updatedCommand = await prisma.command.update({
        where: { id: nextCommand.id },
        data: { status: 'RUNNING' },
      });
      await rabbitWSPublisher.publish('COMMAND.UPDATE', updatedCommand);

      await emitCommandRun(updatedCommand.id);
    }

    await wait(1000);
  }
};
