import { DateTime } from 'luxon';

import { configureExpressHealthCheckFactory, registerHealthCheckDependency } from '../external/healthcheck/healthcheck';

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
        message: 'Failed to connect to universal-test-runner-api',
        error: err,
      };
    }
  },
});

const configureExpressHealthCheck = configureExpressHealthCheckFactory();

export { configureExpressHealthCheck, registerHeartbeat };
