import amqp from 'amqplib';
import IProducer from "../interface/IProducer";
import { rabbitmqConnect, getChannel } from '../../../config/rabbitmq';

export default class RabbitMQMessager implements IProducer {
    private channel: amqp.Channel | null;
    private connection: amqp.Connection | null;
    
    constructor() {
        this.channel = null;
        this.connection = null;
    }
    
    async init(): Promise<void> {
        console.log('111111111111111111111111111111111111111');
        await rabbitmqConnect();
    this.channel = await getChannel();
    this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  }

  async sendToMultipleQueues(data: object): Promise<void> {
    console.log('222222222222222222222222222222222');
    if (!this.channel) {
      await this.init();
    }

    if (!this.channel) {
      throw new Error("Channel is not connected");
    }

    try {
        console.log('33333333333333333333333333333333333333333333');
      await this.channel.assertExchange('fanout_exchange', 'fanout', { durable: true });
      console.log('444444444444444444444444444444444444444444444');
      this.channel.publish('fanout_exchange', '', Buffer.from(JSON.stringify(data)), { persistent: true });
      console.log(`Message sent to all services:`, data);
    } catch (error) {
      console.error('Error in producer:', error);
    }
  }

  async closeConnection(): Promise<void> {
    console.log('5555555555555555555555555555555555555555555');
    if (this.connection) {
      await this.connection.close();
    }
  }
}