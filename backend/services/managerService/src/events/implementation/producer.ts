import amqp from 'amqplib';
import IProducer from "../interface/IProducer";
import { rabbitmqConnect, getChannel } from '../../config/rabbitmq';

export default class RabbitMQMessager implements IProducer {
  private channel: amqp.Channel | null;
  private connection: amqp.Connection | null;

  constructor() {
    this.channel = null;
    this.connection = null;
  }

  async init(): Promise<void> {
    await rabbitmqConnect();
    this.channel = await getChannel();
    this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  }

  async sendToMultipleQueues(data: object): Promise<void> {
    if (!this.channel) {
      await this.init();
    }

    if (!this.channel) {
      throw new Error("Channel is not connected");
    }

    try {
      await this.channel.assertExchange('fanout_exchange', 'fanout', { durable: true });
      this.channel.publish('fanout_exchange', '', Buffer.from(JSON.stringify(data)), { persistent: true });
      console.log(`Message sent to all services:`, data);
    } catch (error) {
      console.error('Error in producer:', error);
    }
  }

  async closeConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
    }
  }
}