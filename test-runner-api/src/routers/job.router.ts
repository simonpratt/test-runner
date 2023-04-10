import { RabbitMqTopic } from '@test-runner/rabbitmq';
import { initTRPC } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { z } from 'zod';

import environment from '../core/environment';
import { Job } from '../generated/client';
import jobService from '../services/job.service';
import { RabbitMqWebsocketDefinition } from '../types/rabbit.types';

const t = initTRPC.create();

type JobEvent = { type: 'create'; job: Job } | { type: 'update'; job: Job } | { type: 'delete'; job: Job };

const publicProcedure = t.procedure;
const router = t.router;

const queueRouter = router({
  submitJob: publicProcedure
    .input(
      z.object({
        environmentId: z.string(),
        dockerImageConfigId: z.string(),
        selector: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await jobService.submitJob({
        environmentId: input.environmentId,
        dockerImageConfigId: input.dockerImageConfigId,
        selector: input.selector,
      });
    }),
  clearJobs: publicProcedure.mutation(async () => {
    return jobService.clearJobs();
  }),
  getJobs: publicProcedure.query(async () => {
    return jobService.getJobs();
  }),
  watchJobs: publicProcedure.subscription(() => {
    return observable<JobEvent>((emit) => {
      const onWatch = (data: JobEvent) => {
        emit.next(data);
      };

      const consumer = new RabbitMqTopic<RabbitMqWebsocketDefinition>(environment.RABBITMQ_WS_EXCHANGE, 'JOB.*');
      consumer.subscribe('JOB.CREATE', (job) => onWatch({ type: 'create', job }));
      consumer.subscribe('JOB.UPDATE', (job) => onWatch({ type: 'update', job }));
      consumer.subscribe('JOB.DELETE', (job) => onWatch({ type: 'delete', job }));

      return () => {
        consumer.disconnect();
      };
    });
  }),
});

export default queueRouter;
