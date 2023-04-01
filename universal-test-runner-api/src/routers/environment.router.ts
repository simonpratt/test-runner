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
        variables: z.array(z.object({ name: z.string(), value: z.string() })),
      }),
    )
    .mutation(async ({ input }) => {
      await environmentService.addEnvironment({
        id: input.id,
        name: input.name,
        variables: input.variables,
      });
    }),
  getEnvironments: publicProcedure.query(async () => {
    return environmentService.getEnvironments();
  }),
});

export default environmentRouter;
