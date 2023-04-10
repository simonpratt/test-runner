import { RabbitMqPublisher } from "./internal/rabbit.publisher";
import { RabbitMqQueue } from "./internal/rabbit.queue";

/**
 * A rabbitmq topic implementation
 * Use this when you want to have every subscriber receive every message. Ie for something like websockets
 */
export class RabbitMqTopic<T> {
  private _publisher: RabbitMqPublisher;
  private _queue: RabbitMqQueue | undefined;

  /**
   * Create the rabbitmq round topic instance
   * 
   * @param exchange The rabbit mq exchange name
   * @param routingKey The routing key to bind to
   */
  constructor(exchange: string, routingKey?: string) {
    this._publisher = new RabbitMqPublisher(exchange, 'topic');

    if (routingKey) {
      this._queue = new RabbitMqQueue(exchange, 'topic', routingKey);
    }
  }

  async publish<E extends keyof T & string>(key: E, message: T[E]) {
    return this._publisher.publish(key, message);
  }

  async subscribe<E extends keyof T & string>(key: E, handler: (data: T[E]) => void) {
    if (!this._queue) {
      throw new Error('Instance is not configured for subscribing');
    }

    return this._queue.handleMessages(key, handler);
  }

  async disconnect() {
    if (this._queue) {
      await this._queue.disconnect();
    }
  }
}
