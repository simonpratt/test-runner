import { initTRPC } from '@trpc/server';
import { z } from 'zod';

import orchestratorService from '../services/orchestrator.service';

const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

const orchestratorRouter = router({
  markCommandFinished: publicProcedure.input(z.object({ commandId: z.string() })).mutation(async ({ input }) => {
    await orchestratorService.markCommandFinished(input.commandId);
  }),
  markCommandAborted: publicProcedure.input(z.object({ commandId: z.string() })).mutation(async ({ input }) => {
    await orchestratorService.markCommandAborted(input.commandId);
  }),
  markCommandFailed: publicProcedure.input(z.object({ commandId: z.string() })).mutation(async ({ input }) => {
    await orchestratorService.markCommandFailed(input.commandId);
  }),
});

export default orchestratorRouter;
