import { prisma } from '../core/prisma.client';
import { DockerImageConfig } from '../generated/client';

export default {
  async addDockerImage(
    config: Pick<DockerImageConfig, 'dockerImage' | 'startCommand' | 'concurrency' | 'isLocalImage'>,
  ) {
    const { dockerImage, startCommand, concurrency, isLocalImage } = config;
    await prisma.dockerImageConfig.create({ data: { dockerImage, startCommand, concurrency, isLocalImage } });
  },

  async getDockerImages() {
    return prisma.dockerImageConfig.findMany();
  },
};
