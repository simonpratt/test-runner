import { RabbitMqBase } from './rabbit.base';

export class RabbitMqPublisher extends RabbitMqBase {
  async publish(key: string, message: any) {
    const channel = await this.getChannel();
    const exchange = await this.getExchange();

    channel.publish(exchange, key, Buffer.from(JSON.stringify(message)));
  }
}
