import chalk from 'chalk';

import { prisma } from '../core/prisma.client';
import { rabbitWSPublisher } from '../core/rabbit';
import asyncForEach from '../helpers/asyncForEach';

export default {
  async getJobs() {
    return prisma.job.findMany();
  },
  async submitJob(config: { environmentId: string; dockerImageConfigId: string; selector: string }) {
    const { environmentId, dockerImageConfigId, selector } = config;

    console.log(chalk.blueBright(`[queue] Submitting job`));

    const job = await prisma.job.create({
      data: {
        environmentId,
        dockerImageConfigId,
        selector,
        status: 'PENDING',
      },
    });
    await rabbitWSPublisher.publish('JOB.CREATE', job);

    const environment = await prisma.environment.findFirst({ where: { id: environmentId } });
    const dockerImageConfig = await prisma.dockerImageConfig.findFirst({ where: { id: dockerImageConfigId } });

    // TODO: Use something pushed from the CI step to break the selector down into actual tests
    //       For now we will just start directly using the selector
    //       Starting directly from the selector would work fine for simple use cases
    let specs: string[] = [];
    if (dockerImageConfig?.concurrency === 'SINGULAR') {
      specs = selector.split(',');
    } else if (dockerImageConfig?.concurrency === 'PARALLEL' && environment?.concurrencyLimit) {
      specs = [];
      for (let i = 0; i < environment?.concurrencyLimit; i++) {
        specs.push(selector);
      }
    }

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
      console.log(`****** publishing ${spec}`);
      await rabbitWSPublisher.publish('COMMAND.CREATE', command);
    }

    return job;
  },
  async clearJobs() {
    const jobs = await prisma.job.findMany();

    asyncForEach(jobs, async (job) => {
      await rabbitWSPublisher.publish('JOB.DELETE', job);
    });

    await prisma.job.deleteMany();
  },
};
