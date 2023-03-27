import chalk from 'chalk';

import { prisma } from '../core/prisma.client';
import { rabbitWSPublisher } from '../core/rabbit';

export default {
  async getJobs() {
    return prisma.job.findMany();
  },
  async submitJob(config: { dockerImage: string; discoverCommand: string; startCommand: string }) {
    const { dockerImage, discoverCommand, startCommand } = config;

    console.log(chalk.blueBright(`[queue] Submitting job`));

    const job = await prisma.job.create({
      data: {
        dockerImage,
        discoverCommand,
        startCommand,
        status: 'DISCOVERY',
      },
    });

    const command = await prisma.command.create({
      data: { jobId: job.id, type: 'DISCOVERY', status: 'PENDING', command: discoverCommand },
    });

    await rabbitWSPublisher.publish('JOB.CREATE', job);
    await rabbitWSPublisher.publish('COMMAND.CREATE', command);

    return job;
  },
};
