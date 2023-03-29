import { z } from 'zod';

const configSchema = z.object({
  CORS_ENABLED_URL: z.string(),
  SERVER_PORT: z.coerce.number(),
  SOCKET_PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  RABBITMQ_WS_EXCHANGE: z.string(),
  RABBITMQ_JOB_EXCHANGE: z.string(),
});

const environment = configSchema.parse(process.env);

export default environment;
