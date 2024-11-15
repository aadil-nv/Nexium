import amqp from 'amqplib';
import { inject, injectable } from 'inversify';
import IConsumer from '../interface/IConsumer';
import IManagerService from '../../../service/interfaces/IManagerService';

@injectable()
export default class Consumer implements IConsumer {
  private managerService: IManagerService;
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  constructor(@inject("IManagerService") managerService: IManagerService) {
    this.managerService = managerService;
  }

  async receiveFromQueue() {
    console.log("Consumer is starting...");

    const queue = 'authenticateQueue';
    const exchange = 'fanout_exchange';

    try {
      // Establish connection

      this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672');
      this.channel = await this.connection.createChannel();

      // Declare queue and exchange
      await this.channel.assertQueue(queue, { durable: true });
      await this.channel.assertExchange(exchange, 'fanout', { durable: true });

      console.log('Waiting for messages in queue...');

      this.channel?.bindQueue(queue, exchange, '');
console.log('111111111111111111111111111111111111111111111');

      this.channel?.consume(queue, async (msg) => {
        console.log('222222222222222222222222222222222222222222222');
        if (msg !== null) {
          try {
            const data = JSON.parse(msg.content.toString());
            console.log('Received businessOwner data:', data);
            console.log('33333333333333333333333333333333333333333333333333');

            if (data.newMangerData) {

                console.log('4444444444444444444444444444444444444444444444');
              await this.managerService.addManager(data.newMangerData);
            }
            // Acknowledge the message after processing
            this.channel?.ack(msg);
          } catch (err) {
            console.error('Error processing message:', err);
            // Negative acknowledge to requeue the message in case of error
            this.channel?.nack(msg, false, true);
          }
        }
      });
      console.log('55555555555555555555555555555555555555555555555555555555');

      // Handle connection close
      this.connection?.on('close', () => {
        console.log('RabbitMQ connection closed');
      });
      console.log('66666666666666666666666666666666666666666666666666666666666');
      // Handle errors on the channel
      this.channel?.on('error', (err) => {
        console.error('Channel error:', err);
      });

    } catch (error) {
      console.error('Error in RabbitMQ consumer:', error);
    }
  }

  // Graceful shutdown: Close connection and channel
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
