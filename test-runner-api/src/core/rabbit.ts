import { RabbitInstance } from '../external/rabbit/rabbit.instance';
import environment from './environment';

export const rabbitWSPublisher = new RabbitInstance(environment.RABBITMQ_WS_EXCHANGE);

export const rabbitJobPublisher = new RabbitInstance(environment.RABBITMQ_JOB_EXCHANGE);