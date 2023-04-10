import ampq from 'amqplib';
import { RabbitMqBase } from './rabbit.base';

export class RabbitMqQueue extends RabbitMqBase {
  private _queuePromise: Promise<ampq.Replies.AssertQueue>;

  private _handlers: { key: string, handler: (data: any) => void }[] = [];

  /**
   * Create a rabbitmq subscriber
   * @param exchange The rabbit mq exchange name
   * @param mode The mode you want the exchange to operate in
   * @param routingKey The routing key to bind to
   * @param queueName The name of the queue to bind to. Leaving this name blank will result in a new queue each time. For round robin load balancing, use the same queue name
   */
  constructor(exchange: string, mode: 'topic' | 'fanout', routingKey: string, queueName?: string) {
    super(exchange, mode);
    this._queuePromise = this.assertQueue(routingKey, queueName);
  }

  private assertQueue(routingKey: string, queueName?: string) {
    return new Promise<ampq.Replies.AssertQueue>(async (resolve) => {
      const channel = await this.getChannel();
      const exchange = await this.getExchange();
  
      // Create a new queue
      // Providing empty string as the queue name will generate a random queue name
      const queue = await channel.assertQueue(queueName || '', { exclusive: queueName ? false : true });
      channel.bindQueue(queue.queue, exchange, routingKey);

      // Consume messages from the queue
      channel.consume(
        queue.queue,
        (msg) => {
          if (msg) {
            channel.ack(msg);
            this.handleNewMessage(msg.fields.routingKey, JSON.parse(msg.content.toString()));
          }
        },
      );

      resolve(queue);
    });
  }

  private async getQueue() {
    return this._queuePromise;
  }

  private handleNewMessage(key: string, content: any) {
    const matchingHandlers = this._handlers.filter((handler) => handler.key === key);
    matchingHandlers.forEach((handler) => handler.handler(content));
  }

  /**
   * 
   * @param key The routing key for this handler. Supports exact key matches only
   * @param handler Handler function for messages
   */
  async handleMessages(key: string, handler: (data: any) => void) {
    this._handlers.push({ key, handler });
  }

  public async disconnect(): Promise<void> {
    const channel = await this.getChannel();
    const queue = await this.getQueue();

    channel.deleteQueue(queue.queue);
  }
}
