import { expressHealthCheckFactory, registerHealthCheckDependency } from '@test-runner/healthcheck';

import { prisma } from './prisma.client';
import { rabbitWSPublisher } from './rabbit';

registerHealthCheckDependency({
  name: 'postgres',
  type: 'database',
  check: async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;

      return {
        status: 'healthy',
      };
    } catch (err) {
      return {
        status: 'unhealthy',
        message: 'Failed to connect to postgres',
        error: err,
      };
    }
  },
});

registerHealthCheckDependency({
  name: 'rabbitmq',
  type: 'queue',
  check: async () => {
    try {
      await rabbitWSPublisher.publish('HEALTH_CHECK.TEST_MESSAGE', { data: 'one two three' });

      return {
        status: 'healthy',
      };
    } catch (err) {
      return {
        status: 'unhealthy',
        message: 'Failed to connect to rabbitmq',
        error: err,
      };
    }
  },
});

const configureExpressHealthCheck = expressHealthCheckFactory();

export { configureExpressHealthCheck };
