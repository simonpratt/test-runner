import { initTRPC } from '@trpc/server';
import { z } from 'zod';

import resultsService from '../services/results.service';

const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

const resultsRouter = router({
  submitTestResults: publicProcedure
    .input(
      z.object({
        commandId: z.string(),
        status: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await resultsService.submitTestResult(input.commandId, input.status);
    }),
});

export default resultsRouter;
