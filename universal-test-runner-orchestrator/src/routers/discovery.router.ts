import { Router } from 'express';
import { z } from 'zod';

import { apiConnector } from '../core/api.connector';

const discoveryRouter = Router();

const discoverBodySchema = z.object({
  tests: z.array(z.string()),
});

const discoverParamsSchema = z.object({
  commandId: z.string().uuid(),
});

discoveryRouter.post('/:commandId', async (req, res) => {
  const { tests } = discoverBodySchema.parse(req.body);
  const { commandId } = discoverParamsSchema.parse(req.params);

  console.log(`[RESULTS] Processing discover for command ${commandId}...`);

  await apiConnector.orchestrator.submitDiscoverResults.mutate({ commandId, tests });

  res.sendStatus(200);
});

export default discoveryRouter;
