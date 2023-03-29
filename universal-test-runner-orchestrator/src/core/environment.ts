import { z } from 'zod';

const envSchema = z.object({
  UNIVERSAL_TEST_RUNNER_API_URL: z.string(),
  SERVER_PORT: z.coerce.number(),
  MAX_CONCURRENT_TASKS: z.coerce.number(),
  RABBITMQ_JOB_EXCHANGE: z.string(),
});

const environment = envSchema.parse(process.env);

export default environment;
