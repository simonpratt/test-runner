import ampq from 'amqplib';
import chalk from 'chalk';

import { getRabbitmqConnection } from './rabbit.common';

let rabbitMqChannelPromise: Promise<ampq.Channel> | undefined = undefined;

const getRabbitMqChannel = async () => {
  if (rabbitMqChannelPromise) {
    return rabbitMqChannelPromise;
  }

  rabbitMqChannelPromise = new Promise<ampq.Channel>(async (resolve) => {
    const connection = await getRabbitmqConnection();
    const channel = await connection.createChannel();

    console.log(chalk.green('[rabbitmq] Connection to rabbitmq server was successful'));
    
    resolve(channel);
  });

  return rabbitMqChannelPromise;
}

export abstract class RabbitMqBase {
  private _exchange: string;
  private _channelPromise: Promise<ampq.Channel>;

  /**
   * Create the base class for rabbit mq functionality
   * @param exchange The rabbit mq exchange name
   * @param mode The mode you want the exchange to operate in
   */
  constructor(exchange: string, mode: 'topic' | 'fanout') {
    this._exchange = exchange;
    this._channelPromise = this.assertChannel(exchange, mode);
  }

  private assertChannel(exchange: string, mode: 'topic' | 'fanout') {
    return new Promise<ampq.Channel>(async (resolve) => {
      const channel = await getRabbitMqChannel();
  
      await channel.assertExchange(exchange, mode, {
        durable: false,
      });

      resolve(channel);
    })
  }

  protected async getChannel() {
    return this._channelPromise;
  }

  protected async getExchange() {
    return this._exchange;
  }

  public async disconnect() {
    // const channel = await this.getChannel();
    // channel.close();
  }
}
