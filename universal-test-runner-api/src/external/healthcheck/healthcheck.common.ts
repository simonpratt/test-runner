import { z } from 'zod';

const envSchema = z
  .object({
    SERVICE_NAMESPACE: z.string().optional().default('unknown'),
    SERVICE_NAME: z.string().optional().default('unknown'),
    SERVICE_VERSION: z.string().optional().default('unknown'),
  })
  .required();

const environment = envSchema.parse(process.env);

export const getHealthCheckVars = () => {
  return environment;
};
