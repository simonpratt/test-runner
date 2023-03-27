import chalk from 'chalk';
import { Router, Express, Request, Response, NextFunction } from 'express';

import { getHealthCheckVars } from './healthcheck.common';

export interface IControllerResponse<T> {
  status: number;
  json?: T;
  url?: string;
}

type IControllerFunction = (req: Request) => Promise<IControllerResponse<any>>;

const wrapMiddleware = (method: IControllerFunction) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await method(req);

    switch (result.status) {
      case 200:
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(result.json);
        return;
      case 503:
        res.status(503).send(result.json);
        return;
      default:
        res.sendStatus(500);
    }
  } catch (err) {
    next(err);
  }
};

export interface IHealthCheckDepResult {
  status: 'healthy' | 'unhealthy';
  message?: string;
  error?: Error | unknown;
}

export interface IHealthCheckDep {
  name: string;
  type: 'database' | 'cache' | 'external' | 'queue' | 'internal' | 'heartbeat';
  check: () => Promise<IHealthCheckDepResult>;
}

export interface IHealthCheck {
  namespace: string;
  service: string;
  version: string;
  deps: IHealthCheckDep[];
}

const healthCheckDependencies: IHealthCheckDep[] = [];

export const registerHealthCheckDependency = (dependency: IHealthCheckDep) => {
  healthCheckDependencies.push(dependency);
};

const getDependencyHealth = async (dependency: IHealthCheckDep) => {
  const { error, ...result } = await dependency.check();

  if (result.status === 'unhealthy') {
    console.log(chalk.yellow(`[health-check] Failed: ${result.message}`), error);
  }

  return {
    name: dependency.name,
    type: dependency.type,
    ...result,
  };
};

const getDependenciesHealth = async () => {
  const results = await Promise.all(healthCheckDependencies.map(getDependencyHealth));
  const allHealthy = results.every((result) => result.status === 'healthy');

  return {
    status: allHealthy ? 'healthy' : 'unhealthy',
    services: results,
  };
};

export const configureExpressHealthCheckFactory = () => (app: Express) => {
  const healthRouter = Router();

  healthRouter.get(
    '/ping',
    wrapMiddleware(async () => ({
      status: 200,
      json: {
        pong: true,
      },
    })),
  );

  healthRouter.get(
    '/healthz',
    wrapMiddleware(async () => {
      const healthCheckResult = await getDependenciesHealth();

      return {
        status: 200,
        json: {
          ...getHealthCheckVars(),
          ...healthCheckResult,
        },
      };
    }),
  );

  healthRouter.get(
    '/readyz',
    wrapMiddleware(async () => {
      const healthCheckResult = await getDependenciesHealth();

      if (healthCheckResult.status === 'healthy') {
        return {
          status: 200,
          json: 'ok',
        };
      }

      return {
        status: 503,
        json: 'unhealthy',
      };
    }),
  );

  app.use('/', healthRouter);
};
