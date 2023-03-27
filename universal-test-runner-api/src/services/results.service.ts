import { prisma } from '../core/prisma.client';

export default {
  async submitTestResult(commandId: string, status: string) {
    console.log(`Submitting test results for ${commandId}`, status);

    const command = await prisma.command.findFirst({ where: { id: commandId }, include: { Job: true } });

    if (!command) {
      throw new Error('Command not found');
    }

    await prisma.command.delete({ where: { id: commandId } });
  },
};
