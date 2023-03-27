import { prisma } from '../core/prisma.client';
import { rabbitWSPublisher } from '../core/rabbit';

export default {
  async getNextCommand() {
    const next = await prisma.command.findFirst({ where: { status: 'PENDING' }, include: { Job: true } });

    if (!next) {
      return undefined;
    }

    // Claim and return
    const updatedCommand = await prisma.command.update({ where: { id: next.id }, data: { status: 'RUNNING' } });
    await rabbitWSPublisher.publish('COMMAND.UPDATE', updatedCommand);
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
    // TODO: Need to bulk insert with pre-defined UUID's so we can bulk grab them again after for the queue publish
    //       Doing this loop will be harsher on the DB
    //       Probably only worth doing if there's a tangible impact
    for (const test of tests) {
      const command = await prisma.command.create({
        data: {
          jobId: job.id,
          type: 'TEST',
          status: 'PENDING',
          command: startCommand.replace('<spec>', test),
        },
      });
      await rabbitWSPublisher.publish('COMMAND.CREATE', command);
    }

    const updatedJob = await prisma.job.update({ where: { id: job.id }, data: { status: 'RUNNING' } });
    await rabbitWSPublisher.publish('JOB.UPDATE', updatedJob);
  },

  async markCommandFinished(commandId: string) {
    console.log(`Processing finished command: ${commandId}`);

    // Update the command to the finished status and publish the update
    const updatedCommand = await prisma.command.update({ where: { id: commandId }, data: { status: 'FINISHED' } });
    await rabbitWSPublisher.publish('COMMAND.UPDATE', updatedCommand);

    // If all commands are finished, mark the job as finished
    // TODO: Should the discovery command go elsewhere?
    //       It will introduce race conditions here
    const finishedCommandCount = await prisma.command.count({
      where: { jobId: updatedCommand.jobId, status: 'FINISHED' },
    });
    const totalCommandCount = await prisma.command.count({ where: { jobId: updatedCommand.jobId } });
    if (finishedCommandCount === totalCommandCount) {
      const updatedJob = await prisma.job.update({ where: { id: updatedCommand.jobId }, data: { status: 'FINISHED' } });
      await rabbitWSPublisher.publish('JOB.UPDATE', updatedJob);
    }
  },

  async markCommandAborted(commandId: string) {
    console.log(`Processing aborted command: ${commandId}`);

    await prisma.command.update({ where: { id: commandId }, data: { status: 'ABORTED' } });
  },
};
