import { RabbitMqPublisher } from '@test-runner/rabbitmq';

import { RabbitMqWebsocketDefinition } from '../types/rabbit.types';
import environment from './environment';

export const rabbitWSPublisher = new RabbitMqPublisher<RabbitMqWebsocketDefinition>(environment.RABBITMQ_WS_EXCHANGE);
