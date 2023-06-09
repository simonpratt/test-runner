import { initTRPC } from '@trpc/server';
import { z } from 'zod';

import dockerImageService from '../services/dockerImageService';

const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

const dockerImageRouter = router({
  addDockerImage: publicProcedure
    .input(
      z.object({
        dockerImage: z.string(),
        startCommand: z.string().optional(),
        concurrency: z.enum(['SINGULAR', 'PARALLEL']),
        isLocalImage: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      await dockerImageService.addDockerImage({
        dockerImage: input.dockerImage,
        startCommand: input.startCommand || null,
        concurrency: input.concurrency,
        isLocalImage: input.isLocalImage,
      });
    }),
  updateDockerImage: publicProcedure
    .input(
      z.object({
        dockerImageId: z.string(),
        dockerImage: z.string(),
        startCommand: z.string().optional(),
        concurrency: z.enum(['SINGULAR', 'PARALLEL']),
        isLocalImage: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      await dockerImageService.updateDockerImage({
        id: input.dockerImageId,
        dockerImage: input.dockerImage,
        startCommand: input.startCommand || null,
        concurrency: input.concurrency,
        isLocalImage: input.isLocalImage,
      });
    }),
  getDockerImages: publicProcedure.query(async () => {
    return dockerImageService.getDockerImages();
  }),
  getDockerImage: publicProcedure.input(z.object({ dockerImageId: z.string() })).query(async ({ input }) => {
    return dockerImageService.getDockerImage(input.dockerImageId);
  }),
});

export default dockerImageRouter;
