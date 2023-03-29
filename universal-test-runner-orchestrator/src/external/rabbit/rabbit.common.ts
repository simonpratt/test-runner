import ampq from 'amqplib';
import chalk from 'chalk';
import { z } from 'zod';

const envSchema = z.object({
  RABBITMQ_USERNAME: z.string().optional(),
  RABBITMQ_PASSWORD: z.string().optional(),
  RABBITMQ_SERVER_ADDRESS: z.string(),
});

const environment = envSchema.parse(process.env);

export const getRabbitConnectionString = () => {
  return environment.RABBITMQ_USERNAME && environment.RABBITMQ_PASSWORD
    ? `amqp://${environment.RABBITMQ_USERNAME}:${environment.RABBITMQ_PASSWORD}@${environment.RABBITMQ_SERVER_ADDRESS}`
    : `amqp://${environment.RABBITMQ_SERVER_ADDRESS}`;
};

const wait = (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};

let connectionPromise: Promise<ampq.Connection>;
let connectionRetryCount = 0;
const createRabbitmqConnection = async (): Promise<ampq.Connection> => {
  try {
    const connection = await ampq.connect(getRabbitConnectionString());
    return connection;
  } catch (err) {
    if (connectionRetryCount < 3) {
      console.log(chalk.yellow('[rabbitmq] Connection failed to rabbitmq server. Trying again in 5 seconds'));
      await wait(5000);
      connectionRetryCount += 1;
      return createRabbitmqConnection();
    }

    console.log(chalk.red('[rabbitmq] Connection failed to rabbitmq server'));
    throw new Error('Connection failed to rabbitmq server');
  }
};

export const getRabbitmqConnection = async (): Promise<ampq.Connection> => {
  if (!connectionPromise) {
    connectionPromise = createRabbitmqConnection();
  }

  return connectionPromise;
};
