import { initTRPC } from '@trpc/server';
import { z } from 'zod';

import environmentService from '../services/environment.service';

const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

const environmentRouter = router({
  addEnvironment: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        concurrencyLimit: z.coerce.number(),
        variables: z.array(z.object({ name: z.string(), value: z.coerce.string() })),
      }),
    )
    .mutation(async ({ input }) => {
      await environmentService.addEnvironment({
        id: input.id,
        name: input.name,
        concurrencyLimit: input.concurrencyLimit,
        variables: input.variables,
      });
    }),
  updateEnvironment: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        concurrencyLimit: z.coerce.number(),
        variables: z.array(z.object({ name: z.string(), value: z.coerce.string() })),
      }),
    )
    .mutation(async ({ input }) => {
      await environmentService.updateEnvironment({
        id: input.id,
        name: input.name,
        concurrencyLimit: input.concurrencyLimit,
        variables: input.variables,
      });
    }),
  getEnvironments: publicProcedure.query(async () => {
    return environmentService.getEnvironments();
  }),
  getEnvironment: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    return environmentService.getEnvironment(input.id);
  }),
});

export default environmentRouter;
