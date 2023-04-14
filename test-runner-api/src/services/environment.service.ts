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

  async updateEnvironment(config: {
    id: string;
    name: string;
    concurrencyLimit: number;
    variables: { name: string; value: string }[];
  }) {
    const { id, name, concurrencyLimit, variables } = config;

    await prisma.environment.update({
      where: { id },
      data: { name, concurrencyLimit },
    });

    await prisma.environmentVariable.deleteMany({ where: { environmentId: id } });
    await prisma.environmentVariable.createMany({ data: variables.map((v) => ({ ...v, environmentId: id })) });
  },

  async getEnvironments() {
    return prisma.environment.findMany({ include: { EnvironmentVariable: true } });
  },

  async getEnvironment(environmentId: string) {
    return prisma.environment.findUnique({ where: { id: environmentId }, include: { EnvironmentVariable: true } });
  },
};
