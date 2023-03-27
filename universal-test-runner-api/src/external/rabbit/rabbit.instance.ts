import ampq from 'amqplib';
import chalk from 'chalk';

import { getRabbitmqConnection } from './rabbit.common';

export class RabbitInstance {
  private _exchange: string;
  private _channel: ampq.Channel | undefined = undefined;

  private _pendingSubscriptions: { key: string; handler: (data: Record<string, any>) => void }[] = [];

  constructor(exchange: string) {
    this._exchange = exchange;

    this.initPublisher();
  }

  private async initPublisher() {
    const connection = await getRabbitmqConnection();
    const channel = await connection.createChannel();

    await channel.assertExchange(this._exchange, 'topic', {
      durable: false,
    });

    // Bind
    this._channel = channel;

    // Backfill the subscription if it was created
    this.backfillSubscription();

    // Log success
    console.log(chalk.green('[rabbitmq] Connection to rabbitmq server was successful'));
  }

  async publish(key: string, message: Record<string, any>) {
    if (!this._channel || !this._exchange) {
      console.log(chalk.red('[rabbitmq] Channel connection could not be found'));
      throw new Error('Channel connection could not be found');
    }

    this._channel.publish(this._exchange, key, Buffer.from(JSON.stringify(message)));
  }

  async subscribe(key: string, handler: (data: Record<string, any>) => void) {
    if (!this._channel || !this._exchange) {
      this._pendingSubscriptions.push({ key, handler });
      return;
    }

    const queue = await this._channel.assertQueue('', { exclusive: true });
    this._channel.bindQueue(queue.queue, this._exchange, key);

    this._channel.consume(
      queue.queue,
      (msg) => {
        if (msg?.content) {
          handler(JSON.parse(msg.content.toString()));
        }
      },
      {
        noAck: true,
      },
    );
  }

  private backfillSubscription() {
    let pendingSub = this._pendingSubscriptions.pop();
    while (pendingSub) {
      this.subscribe(pendingSub.key, pendingSub.handler);
      pendingSub = this._pendingSubscriptions.pop();
    }
  }

  public disconnect() {
    this._channel?.close();
  }
}
