import amqp from 'amqplib';
import IProducer from "../interface/IProducer";
import { rabbitmqConnect, getChannel } from '../../../config/rabbitmq';



export default class RabbitMQMessager implements IProducer {
  private _channel: amqp.Channel | null;
  private _connection: amqp.Connection | null;
  
  constructor() {
    this._channel = null;
    this._connection = null;
  }
  
  async init(): Promise<void> {
    console.log(`************************************`.bgGreen);
    console.log( process.env.RABBITMQ_URL);
    
    console.log(`************************************`.bgGreen);
    await rabbitmqConnect();
    this._channel = await getChannel();
    this._connection = await amqp.connect(process.env.RABBITMQ_URL as string);
  }
  
  async sendToMultipleQueues(data: object): Promise<void> {
    if (!this._channel) {
      await this.init();
    }

    if (!this._channel) {
      throw new Error("Channel is not connected");
    }
    
    try {
      await this._channel.assertExchange('fanout_exchange', 'fanout', { durable: true });
      this._channel.publish('fanout_exchange', '', Buffer.from(JSON.stringify(data)), { persistent: true });
      console.log(`Message sent to all services:`.bgBlue.white.bold, data);
    } catch (error) {
      console.error('Error in producer:', error);
    }
  }

  async closeConnection(): Promise<void> {
    if (this._connection) {
      await this._connection.close();
    }
  }
}
