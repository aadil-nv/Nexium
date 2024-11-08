import amqp from 'amqplib';
import { inject, injectable } from 'inversify';
import IConsumer from 'entities/consumerEntities';
import IBusinessOwnerService from 'service/interface/IBusinessOwnerService';

@injectable()
export default class BusinessOwnerConsumer implements IConsumer {
  private businessOwnerService: IBusinessOwnerService;
<<<<<<< HEAD
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
=======
>>>>>>> cc3e19bf05b3d09f1064503815fc8de7f3466ed0

  constructor(@inject("IBusinessOwnerService") businessOwnerService: IBusinessOwnerService) {
    this.businessOwnerService = businessOwnerService;
  }

  async receiveFromQueue() {
<<<<<<< HEAD
    console.log("Consumer is starting...");

    const queue = 'superAdminQueue';
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

      // Handle incoming messages
      this.channel?.consume(queue, async (msg) => {  
        if (msg !== null) {
          try {
            const businessOwnerData = JSON.parse(msg.content.toString());
            console.log('Received businessOwner data:', businessOwnerData);

            // Register the business owner
            await this.businessOwnerService.registerBusinessOwner(businessOwnerData);

            // Acknowledge the message
            this.channel?.ack(msg);
          } catch (err) {
            console.error('Error processing message:', err);
            this.channel?.nack(msg, false, true);  // Requeue the message in case of error
          }
        }
      });

      // Handle connection close
      this.connection?.on('close', () => {  
        console.log('RabbitMQ connection closed');
      });

      // Handle errors on the channel
      this.channel?.on('error', (err) => {  
        console.error('Channel error:', err);
      });

=======
    console.log("touched consumer from ------------------");

    const queue = 'superAdminQueue';
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
      const channel = await connection.createChannel();

      await channel.assertQueue(queue, { exclusive: true });
      console.log('Waiting for messages in queue...');

      await channel.bindQueue(queue, 'fanout_exchange', '');

      channel.consume(queue, async (msg) => {
        if (msg !== null) {
          const businessOwnerData = JSON.parse(msg.content.toString());
          console.log('Received businessOwner data:', businessOwnerData);

          await this.businessOwnerService.registerBusinessOwner(businessOwnerData);

          channel.ack(msg);
        }
      });
>>>>>>> cc3e19bf05b3d09f1064503815fc8de7f3466ed0
    } catch (error) {
      console.error('Error in RabbitMQ consumer:', error);
    }
  }
<<<<<<< HEAD

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
=======
}
>>>>>>> cc3e19bf05b3d09f1064503815fc8de7f3466ed0
