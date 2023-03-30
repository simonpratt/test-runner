import { prisma } from './core/prisma.client';
import { rabbitJobPublisher, rabbitWSPublisher } from './core/rabbit';

let running = true;

export const stopCommandLoop = () => {
  running = false;
};

const wait = (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};

export const startCommandLoop = async () => {
  while (running) {
    const nextCommand = await prisma.command.findFirst({
      where: { status: 'PENDING' },
      include: { Job: { include: { dockerImageConfig: true } } },
    });

    // Claim and emit if there is a command
    if (nextCommand) {
      const updatedCommand = await prisma.command.update({
        where: { id: nextCommand.id },
        data: { status: 'RUNNING' },
      });
      await rabbitWSPublisher.publish('COMMAND.UPDATE', updatedCommand);
      await rabbitJobPublisher.publish('COMMAND.NEW', nextCommand);
    }

    await wait(1000);
  }
};
