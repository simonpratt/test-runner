import { prisma } from '../core/prisma.client';

export default {
  async getNextCommand() {
    const next = await prisma.command.findFirst({ where: { status: 'PENDING' }, include: { Job: true } });

    if (!next) {
      return undefined;
    }

    // Claim and return
    await prisma.command.update({ where: { id: next.id }, data: { status: 'RUNNING' } });
    return {
      id: next.id,
      dockerImage: next.Job.dockerImage,
      command: next.command,
    };
  },

  async submitDiscoveryResults(commandId: string, tests: string[]) {
    console.log(`Processing discovery results for ${commandId}`, tests);

    const command = await prisma.command.findFirst({ where: { id: commandId }, include: { Job: true } });

    if (!command) {
      throw new Error('Command not found');
    }

    const job = command.Job;
    const startCommand = job.startCommand;
    await prisma.command.createMany({
      data: tests.map((test) => ({
        jobId: job.id,
        type: 'TEST',
        status: 'PENDING',
        command: startCommand.replace('<spec>', test),
      })),
    });
  },

  async markCommandFinished(commandId: string) {
    console.log(`Processing finished command: ${commandId}`);

    await prisma.command.update({ where: { id: commandId }, data: { status: 'FINISHED' } });
  },

  async markCommandAborted(commandId: string) {
    console.log(`Processing aborted command: ${commandId}`);

    await prisma.command.update({ where: { id: commandId }, data: { status: 'ABORTED' } });
  },
};
