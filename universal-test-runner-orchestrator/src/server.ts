import bodyParser from 'body-parser';
import chalk from 'chalk';
import express from 'express';
import morgan from 'morgan';

import environment from './core/environment';
import { configureExpressHealthCheck } from './core/healthcheck';
import discoveryRouter from './routers/discovery.router';

export const startServer = async () => {
  const app = express();
  app.use(morgan('short'));

  // Health check
  configureExpressHealthCheck(app);

  app.use(bodyParser.json());

  app.use('/discovery', discoveryRouter);

  const server = app.listen(environment.SERVER_PORT, () => {
    console.log(chalk.green(`[express] Server started on port ${environment.SERVER_PORT}`));
  });

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
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};
