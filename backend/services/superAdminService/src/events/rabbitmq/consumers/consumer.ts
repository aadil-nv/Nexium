import amqp from 'amqplib';
import { inject, injectable } from 'inversify';
import IConsumer from '../../../entities/consumerEntities';
import IBusinessOwnerService from 'service/interface/IBusinessOwnerService';

@injectable()
export default class BusinessOwnerConsumer implements IConsumer {
  private businessOwnerService: IBusinessOwnerService;
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  constructor(@inject("IBusinessOwnerService") businessOwnerService: IBusinessOwnerService) {
    this.businessOwnerService = businessOwnerService;
  }

  async receiveFromQueue() {
    console.log("Consumer is starting...");

    const queue = 'superAdminQueue';
    const exchange = 'fanout_exchange';

    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL as string);
      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue(queue, { durable: true });
      await this.channel.assertExchange(exchange, 'fanout', { durable: true });

      console.log('Waiting for messages in queue...');

      this.channel?.bindQueue(queue, exchange, '');

      this.channel?.consume(queue, async (msg) => {
        if (msg !== null) {
          try {
            const data = JSON.parse(msg.content.toString());
            console.log('rebiit data sented in fanout:', data);

            this.channel?.ack(msg);
          } catch (err) {
            console.error('Error processing message:', err);
            this.channel?.nack(msg, false, true);
          }
        }
      });

      this.connection?.on('close', () => {
        console.log('RabbitMQ connection closed');
      });

      this.channel?.on('error', (err) => {
        console.error('Channel error:', err);
      });

    } catch (error) {
      console.error('Error in RabbitMQ consumer:', error);
    }
  }


  async shutdown() {
    try {
      if (this.channel) {
        await this.channel.close();
        console.log('Channel closed');
      }
      if (this.connection) {
        await this.connection.close();
        console.log('Connection closed');
      }
    } catch (error) {
      console.error('Error during shutdown:', error);
    }
  }
}
