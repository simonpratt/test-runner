import { prisma } from '../core/prisma.client';

export default {
  async addEnvironment(config: { id: string; name: string; variables: { name: string; value: string }[] }) {
    const { id, name, variables } = config;
    await prisma.environment.create({ data: { id, name, EnvironmentVariable: { createMany: { data: variables } } } });
  },

  async getEnvironments() {
    return prisma.environment.findMany({ include: { EnvironmentVariable: true } });
  },
};
