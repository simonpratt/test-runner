import { prisma } from '../core/prisma.client';

export default {
  async addDockerImage(config: { dockerImage: string; startCommand?: string; isLocalImage: boolean }) {
    const { dockerImage, startCommand, isLocalImage } = config;
    await prisma.dockerImageConfig.create({ data: { dockerImage, startCommand, isLocalImage } });
  },

  async getDockerImages() {
    return prisma.dockerImageConfig.findMany();
  },
};
