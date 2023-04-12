import { prisma } from '../core/prisma.client';
import { rabbitWSPublisher } from '../core/rabbit';

export default {
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

    await prisma.command.updateMany({ where: { id: commandId }, data: { status: 'ABORTED' } });
  },

  async markCommandFailed(commandId: string) {
    console.log(`Processing failed command: ${commandId}`);

    await prisma.command.updateMany({ where: { id: commandId }, data: { status: 'FAILED' } });
  },
};
