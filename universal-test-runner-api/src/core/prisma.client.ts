import { PrismaClient } from '../generated/client/index';
import environment from './environment';

export const prisma = new PrismaClient({ datasources: { db: { url: environment.DATABASE_URL } } });
