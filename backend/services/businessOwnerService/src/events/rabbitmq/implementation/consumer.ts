import amqp from 'amqplib';
import { inject, injectable } from 'inversify';
import IConsumer from '../interface/IConsumer';
import IBusinessOwnerService from 'service/interface/IBusinessOwnerService';

@injectable()
export default class BusinessOwnerConsumer implements IConsumer {
  private businessOwnerService: IBusinessOwnerService;

  constructor(@inject("IBusinessOwnerService") businessOwnerService: IBusinessOwnerService) {
    this.businessOwnerService = businessOwnerService;
  }

  async receiveFromQueue() {
<<<<<<< HEAD
    console.log("Consumer initialized...");

    const queue = 'businessOwnerQueue';
    const exchange = 'fanout_exchange';

    try {
 
      const connection = await amqp.connect('amqp://localhost:5672');
      const channel = await connection.createChannel();

      await channel.assertExchange(exchange, 'fanout', { durable: true });

      // Assert the queue without exclusivity for persistence
      await channel.assertQueue(queue, { durable: true });
      console.log('Waiting for messages in queue...');

      // Bind the queue to the exchange
      await channel.bindQueue(queue, exchange, '');

      // Consume messages from the queue
      channel.consume(queue, async (msg) => {
        if (msg !== null) {
          try {
            const businessOwnerData = JSON.parse(msg.content.toString());
            console.log('Received businessOwner data:', businessOwnerData);

            // Call the service layer to handle the data
            await this.businessOwnerService.registerBusinessOwner(businessOwnerData);

            // Acknowledge the message after processing
            channel.ack(msg);
          } catch (err) {
            console.error('Error processing message:', err);
            // Optionally, nack the message if there's an error processing it
            channel.nack(msg);
          }
=======
    console.log("touched consumer from ------------------");

    const queue = 'businessOwnerQueue';
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

          // Call the businessOwnerRegister function from the service layer
          await this.businessOwnerService.registerBusinessOwner(businessOwnerData);

          channel.ack(msg);
>>>>>>> cc3e19bf05b3d09f1064503815fc8de7f3466ed0
        }
      });
    } catch (error) {
      console.error('Error in RabbitMQ consumer:', error);
<<<<<<< HEAD
      // Handle connection/channel errors gracefully
    }
  }
}
=======
    }
  }
}
>>>>>>> cc3e19bf05b3d09f1064503815fc8de7f3466ed0
