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
        isLocalImage: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      await dockerImageService.addDockerImage({
        dockerImage: input.dockerImage,
        startCommand: input.startCommand,
        isLocalImage: input.isLocalImage,
      });
    }),
  getDockerImages: publicProcedure.query(async () => {
    return dockerImageService.getDockerImages();
  }),
});

export default dockerImageRouter;
