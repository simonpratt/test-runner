import chalk from 'chalk';
import express from 'express';
import morgan from 'morgan';

import environment from './core/environment';
import { configureExpressHealthCheck } from './core/healthcheck';

export const startServer = async () => {
  const app = express();
  app.use(morgan('short'));

  // Health check
  configureExpressHealthCheck(app);

  app.listen(environment.SERVER_PORT, () => {
    console.log(chalk.green(`[express] Server started on port ${environment.SERVER_PORT}`));
  });
};
