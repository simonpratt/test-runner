import { expressHealthCheckFactory, registerHealthCheckDependency } from '@test-runner/healthcheck';
import { DateTime } from 'luxon';

import { testKubernetesConnection } from '../services/kubernetes.service';

let lastHeartbeatTime = DateTime.now();
const registerHeartbeat = () => {
  lastHeartbeatTime = DateTime.now();
};

registerHealthCheckDependency({
  name: 'internal-poll',
  type: 'heartbeat',
  check: async () => {
    try {
      const nowDate = DateTime.now();
      const { seconds } = nowDate.diff(lastHeartbeatTime, 'seconds').toObject();

      if (seconds && seconds > 60) {
        return {
          status: 'unhealthy',
          message: 'Jobs have not been polled for 60 seconds or more',
        };
      }

      return {
        status: 'healthy',
      };
    } catch (err) {
      return {
        status: 'unhealthy',
        message: 'Failed to connect to test-runner-api',
        error: err,
      };
    }
  },
});

registerHealthCheckDependency({
  name: 'kubernetes',
  type: 'external',
  check: async () => {
    try {
      await testKubernetesConnection();

      return {
        status: 'healthy',
      };
    } catch (err) {
      return {
        status: 'unhealthy',
        message: 'Failed to connect to kubernetes',
        error: err,
      };
    }
  },
});

const configureExpressHealthCheck = expressHealthCheckFactory();

export { configureExpressHealthCheck, registerHeartbeat };
