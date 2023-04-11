import { RabbitMqPublisher } from '@test-runner/rabbitmq';
import chalk from 'chalk';

import environment from './core/environment';
import { prisma } from './core/prisma.client';
import { rabbitWSPublisher } from './core/rabbit';
import { RabbitMqCommandRunDefinition } from './types/rabbit.types';

let running = true;

export const stopCommandLoop = () => {
  running = false;
};

const wait = (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};

const commandPublisher = new RabbitMqPublisher<RabbitMqCommandRunDefinition>(environment.RABBITMQ_JOB_EXCHANGE);

const emitCommandRun = async (commandId: string) => {
  const command = await prisma.command.findUnique({
    where: { id: commandId },
    include: { Job: { include: { dockerImageConfig: true, Environment: { include: { EnvironmentVariable: true } } } } },
  });

  if (!command) {
    throw new Error('Command not found');
  }

  const runCommand = {
    commandId: command.id,
    dockerImage: command.Job.dockerImageConfig.dockerImage,
    startCommand: command.Job.dockerImageConfig.startCommand || undefined,
    variables: [
      ...(command.Job.Environment?.EnvironmentVariable.map((v) => ({ name: v.name, value: v.value })) || []),
      { name: 'TEST_SPEC', value: command.spec },
      { name: 'TEST_RUN_ID', value: command.Job.id },
      { name: 'TEST_COMMAND_ID', value: command.id },
    ],
  };
  await commandPublisher.publish('COMMAND.RUN', runCommand);
};

export const startCommandLoop = async () => {
  while (running) {
    const nextCommand = await prisma.command.findFirst({
      where: { status: 'PENDING' },
    });

    // Claim and emit if there is a command
    if (nextCommand) {
      console.log(chalk.grey(`[command-loop] Starting command ${nextCommand.id}`));

      const updatedCommand = await prisma.command.update({
        where: { id: nextCommand.id },
        data: { status: 'RUNNING' },
      });
      await rabbitWSPublisher.publish('COMMAND.UPDATE', updatedCommand);

      try {
        await emitCommandRun(updatedCommand.id);
      } catch (err) {
        console.log(chalk.red(`[command-loop] Error emitting command`));
      }
    }

    await wait(1000);
  }
};
