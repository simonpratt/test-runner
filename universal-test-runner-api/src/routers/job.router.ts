import { initTRPC } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { z } from 'zod';

import environment from '../core/environment';
import { RabbitInstance } from '../external/rabbit/rabbit.instance';
import { Job } from '../generated/client';
import job from '../services/job.service';

const t = initTRPC.create();

type JobEvent = { type: 'create'; job: Job } | { type: 'update'; job: Job } | { type: 'delete'; job: Job };

const publicProcedure = t.procedure;
const router = t.router;

const queueRouter = router({
  submitJob: publicProcedure
    .input(
      z.object({
        dockerImage: z.string(),
        discoverCommand: z.string(),
        startCommand: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await job.submitJob({
        dockerImage: input.dockerImage,
        discoverCommand: input.discoverCommand,
        startCommand: input.startCommand,
      });
    }),
  watchJobs: publicProcedure.subscription(() => {
    return observable<JobEvent>((emit) => {
      const onWatch = (data: JobEvent) => {
        emit.next(data);
      };

      const consumer = new RabbitInstance(environment.RABBITMQ_WS_EXCHANGE);
      consumer.subscribe('JOB.CREATE', (job: any) => onWatch({ type: 'create', job }));
      consumer.subscribe('JOB.UPDATE', (job: any) => onWatch({ type: 'update', job }));
      consumer.subscribe('JOB.DELETE', (job: any) => onWatch({ type: 'delete', job }));

      return () => {
        consumer.disconnect();
      };
    });
  }),
});

export default queueRouter;
