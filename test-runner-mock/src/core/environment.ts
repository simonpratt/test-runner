import z from 'zod';

const envSchema = z.object({
  DISCOVERY_POST_URL: z.string(),
});

const environment = envSchema.parse(process.env);

export default environment;
