import { prisma } from '../core/prisma.client';

export default {
  async addEnvironment(config: {
    id: string;
    name: string;
    concurrencyLimit: number;
    variables: { name: string; value: string }[];
  }) {
    const { id, name, concurrencyLimit, variables } = config;
    await prisma.environment.create({
      data: { id, name, concurrencyLimit, EnvironmentVariable: { createMany: { data: variables } } },
    });
  },

  async getEnvironments() {
    return prisma.environment.findMany({ include: { EnvironmentVariable: true } });
  },
};
