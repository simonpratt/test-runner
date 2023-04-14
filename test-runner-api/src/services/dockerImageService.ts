import { prisma } from '../core/prisma.client';
import { DockerImageConfig } from '../generated/client';

export default {
  async addDockerImage(
    config: Pick<DockerImageConfig, 'dockerImage' | 'startCommand' | 'concurrency' | 'isLocalImage'>,
  ) {
    const { dockerImage, startCommand, concurrency, isLocalImage } = config;
    await prisma.dockerImageConfig.create({ data: { dockerImage, startCommand, concurrency, isLocalImage } });
  },

  async updateDockerImage(
    config: Pick<DockerImageConfig, 'id' | 'dockerImage' | 'startCommand' | 'concurrency' | 'isLocalImage'>,
  ) {
    const { id, dockerImage, startCommand, concurrency, isLocalImage } = config;
    await prisma.dockerImageConfig.update({
      where: { id },
      data: { dockerImage, startCommand, concurrency, isLocalImage },
    });
  },

  async getDockerImages() {
    return prisma.dockerImageConfig.findMany();
  },

  async getDockerImage(dockerImageId: string) {
    return prisma.dockerImageConfig.findUnique({ where: { id: dockerImageId } });
  },
};
