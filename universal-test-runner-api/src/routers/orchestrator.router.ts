import { initTRPC } from '@trpc/server';
import { z } from 'zod';

import orchestratorService from '../services/orchestrator.service';

const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

const orchestratorRouter = router({
  submitDiscoverResults: publicProcedure
    .input(
      z.object({
        commandId: z.string(),
        tests: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      await orchestratorService.submitDiscoveryResults(input.commandId, input.tests);
    }),
  getNextCommand: publicProcedure.query(async () => {
    return orchestratorService.getNextCommand();
  }),
  markCommandFinished: publicProcedure.input(z.object({ commandId: z.string() })).mutation(async ({ input }) => {
    await orchestratorService.markCommandFinished(input.commandId);
  }),
  markCommandAborted: publicProcedure.input(z.object({ commandId: z.string() })).mutation(async ({ input }) => {
    await orchestratorService.markCommandAborted(input.commandId);
  }),
});

export default orchestratorRouter;
