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
    console.log("Consumer initialized...");

    const queue = 'businessOwnerQueue';
    const exchange = 'fanout_exchange';

    try {
      const connection = await amqp.connect('amqp://localhost:5672');
      const channel = await connection.createChannel();

      await channel.assertExchange(exchange, 'fanout', { durable: true });

      await channel.assertQueue(queue, { durable: true });
      console.log('Waiting for messages in queue...');

      await channel.bindQueue(queue, exchange, '');

      // Handle messages as they come in
      channel.consume(queue, async (msg) => {
        if (msg !== null) {
          try {
            const data = JSON.parse(msg.content.toString());


            if (Array.isArray(data)) {
              // If multiple data pieces, handle each one separately
              for (const businessOwnerData of data) {
                await this.processBusinessOwnerData(businessOwnerData);
              }
            } else {
              // If it's a single data piece, process it
              await this.processBusinessOwnerData(data);
            }

            // Acknowledge the message
            channel.ack(msg);
          } catch (err) {
            console.error('Error processing message:', err);

            // Negative acknowledge if an error occurs
            channel.nack(msg);
          }
        }
      });
    } catch (error) {
      console.error('Error in RabbitMQ consumer:', error);
    }
  }

  // Helper method to process business owner data
  private async processBusinessOwnerData(data: any) {
    try {

      if (data.businessOwnerData) {
        await this.businessOwnerService.registerBusinessOwner(data.businessOwnerData);
      }

      if (data.subscriptionData) {
        await this.businessOwnerService.addSubscription(data.subscriptionData);
      }
    } catch (err) {
      console.error('Error processing businessOwner data:', err);
      throw err;
    }
  }
}
