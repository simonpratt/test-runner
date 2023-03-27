import { prisma } from '../core/prisma.client';

export default {
  async getCommands() {
    return prisma.command.findMany();
  },
};
