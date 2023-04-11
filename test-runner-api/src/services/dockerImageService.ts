import { prisma } from '../core/prisma.client';

export default {
  async addDockerImage(config: { dockerImage: string; startCommand?: string }) {
    const { dockerImage, startCommand } = config;
    await prisma.dockerImageConfig.create({ data: { dockerImage, startCommand } });
  },

  async getDockerImages() {
    return prisma.dockerImageConfig.findMany();
  },
};
