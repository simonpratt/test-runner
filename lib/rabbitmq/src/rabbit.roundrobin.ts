import { RabbitMqPublisher } from "./internal/rabbit.publisher";
import { RabbitMqQueue } from "./internal/rabbit.queue";

/**
 * A rabbitmq round robin implementation
 * Use this when you will have multiple subscribers operating in a round robin fashion
 */
export class RabbitMqRoundRobin<T> {
  private _publisher: RabbitMqPublisher;
  private _queue: RabbitMqQueue;

  /**
   * Create the rabbitmq round robin instance
   * 
   * @param exchange The rabbit mq exchange name
   * @param queue The name of the queue to bind to. This must match for all instances that you want to share events between.
   * @param routingKey The routing key to bind to
   */
  constructor(exchange: string, queue: string, routingKey: string) {
    this._publisher = new RabbitMqPublisher(exchange, 'topic');
    this._queue = new RabbitMqQueue(exchange, 'topic', routingKey, queue);
  }

  async publish<E extends keyof T & string>(key: E, message: T[E]) {
    return this._publisher.publish(key, message);
  }

  async subscribe<E extends keyof T & string>(key: E, handler: (data: T[E]) => void) {
    return this._queue.handleMessages(key, handler);
  }

  async disconnect() {
    return this._queue.disconnect();
  }
}
