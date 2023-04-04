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
        name: z.string(),
        dockerImage: z.string(),
        startCommand: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await dockerImageService.addDockerImage({
        name: input.name,
        dockerImage: input.dockerImage,
        startCommand: input.startCommand,
      });
    }),
  getDockerImages: publicProcedure.query(async () => {
    return dockerImageService.getDockerImages();
  }),
});

export default dockerImageRouter;
