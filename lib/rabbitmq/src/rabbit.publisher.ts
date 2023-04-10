import { RabbitMqPublisher as RabbitMqPublisherBase } from "./internal/rabbit.publisher";
import { RabbitMqQueue } from "./internal/rabbit.queue";

/**
 * A rabbitmq publisher implementation
 * Use this to publish rabbitmq messages to a topic-based exchange
 */
export class RabbitMqPublisher<T> {
  private _publisher: RabbitMqPublisherBase;

  /**
   * Create the rabbitmq publisher instance
   *
   * @param exchange The rabbit mq exchange name
   */
  constructor(exchange: string) {
    this._publisher = new RabbitMqPublisherBase(exchange, "topic");
  }

  async publish<E extends keyof T & string>(key: E, message: T[E]) {
    return this._publisher.publish(key, message);
  }
}
