import { prisma } from '../core/prisma.client';

export default {
  async addDockerImage(config: { name: string; dockerImage: string; startCommand: string }) {
    const { name, dockerImage, startCommand } = config;
    await prisma.dockerImageConfig.create({ data: { name, dockerImage, startCommand } });
  },

  async getDockerImages() {
    return prisma.dockerImageConfig.findMany({ include: { DockerImageConfigVariable: true } });
  },
};
