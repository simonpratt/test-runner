import chalk from 'chalk';

import { prisma } from '../core/prisma.client';
import { rabbitWSPublisher } from '../core/rabbit';

export default {
  async getJobs() {
    return prisma.job.findMany();
  },
  async submitJob(config: { dockerImage: string; startCommand: string; selector: string }) {
    const { dockerImage, startCommand, selector } = config;

    console.log(chalk.blueBright(`[queue] Submitting job`));

    const job = await prisma.job.create({
      data: {
        dockerImage,
        startCommand,
        selector,
        status: 'PENDING',
      },
    });
    await rabbitWSPublisher.publish('JOB.CREATE', job);

    // TODO: Use something pushed from the CI step to break the selector down into actual tests
    //       For now we will just start directly using the selector
    //       Starting directly from the selector would work fine for simple use cases
    const specs = selector.split(',');

    // TODO: Need to bulk insert with pre-defined UUID's so we can bulk grab them again after for the queue publish
    //       Doing this loop will be harsher on the DB
    //       Probably only worth doing if there's a tangible impact
    for (const spec of specs) {
      const command = await prisma.command.create({
        data: {
          jobId: job.id,
          status: 'PENDING',
          spec: spec,
        },
      });
      await rabbitWSPublisher.publish('COMMAND.CREATE', command);
    }

    return job;
  },
};
