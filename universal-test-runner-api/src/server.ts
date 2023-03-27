import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import chalk from 'chalk';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import ws from 'ws';

import environment from './core/environment';
import errors from './core/errors';
import { configureExpressHealthCheck } from './core/healthcheck';
import commandRouter from './routers/command.router';
import jobRouter from './routers/job.router';
import orchestratorRouter from './routers/orchestrator.router';
import resultsRouter from './routers/results.router';

const t = initTRPC.create();

const router = t.router;

const rootRouter = router({
  job: jobRouter,
  command: commandRouter,
  orchestrator: orchestratorRouter,
  results: resultsRouter,
});

export type RootRouter = typeof rootRouter;

export default rootRouter;

export const startServer = async () => {
  const app = express();
  app.use(morgan('short'));

  // Health check
  configureExpressHealthCheck(app);

  // CORS Config
  const whitelist = environment.CORS_ENABLED_URL.split(',');
  const corsOptions = {
    origin: function (origin: string, callback: any) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new errors.CrossOriginError('Not allowed by CORS'));
      }
    },
    credentials: true,
  };
  app.use(cors(corsOptions as any));

  app.use(
    '/',
    trpcExpress.createExpressMiddleware({
      router: rootRouter,
      createContext() {
        return {};
      },
    }),
  );

  const server = app.listen(environment.SERVER_PORT, () => {
    console.log(chalk.green(`[express] Server started on port ${environment.SERVER_PORT}`));
  });

  ///////////////////
  // Socket Server
  const wss = new ws.Server({
    port: environment.SOCKET_PORT,
  });

  const handler = applyWSSHandler({ wss, router: rootRouter, createContext: () => ({}) });
  wss.on('connection', (ws) => {
    console.log(`➕➕ Connection (${wss.clients.size})`);
    ws.once('close', () => {
      console.log(`➖➖ Connection (${wss.clients.size})`);
    });
  });
  console.log(chalk.green(`[sockets] WS Server started on port ${environment.SOCKET_PORT}`));

  const shutdown = () => {
    console.log('Received kill signal, shutting down gracefully');
    server.close(() => {
      console.log('Closed out remaining connections');
      process.exit(0);
    });

    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);

    handler.broadcastReconnectNotification();
    wss.close();
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};
