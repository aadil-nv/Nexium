import amqp from 'amqplib';
import { inject, injectable } from 'inversify';
import IConsumer from '../interface/IConsumer';
import IBusinessOwnerService from 'service/interface/IBusinessOwnerService';

@injectable()
export default class BusinessOwnerConsumer implements IConsumer {
  private _businessOwnerService: IBusinessOwnerService;

  constructor(@inject("IBusinessOwnerService") businessOwnerService: IBusinessOwnerService) {
    this._businessOwnerService = businessOwnerService;
  }

  // Receive messages from the RabbitMQ queue
  async receiveFromQueue() {
    const queue = 'businessOwnerQueue';
    const exchange = 'fanout_exchange';

    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
      const channel = await connection.createChannel();

      await channel.assertExchange(exchange, 'fanout', { durable: true });
      await channel.assertQueue(queue, { durable: true });
      console.log(`Waiting for messages in queue...`.bgRed.white.bold);

      await channel.bindQueue(queue, exchange, '');

      // Handle incoming messages
      channel.consume(queue, async (msg) => {
        if (msg) {
          try {
            const data = JSON.parse(msg.content.toString());          
            if (Array.isArray(data)) {
              // Process each item if it's an array
              for (const businessOwnerData of data) {
                await this._processBusinessOwnerData(businessOwnerData);
              }
            } else {
              await this._processBusinessOwnerData(data);
            }

            channel.ack(msg);
          } catch (err) {
            console.error('Error processing message:', err);
            channel.nack(msg); 
          }
        }
      });
    } catch (error) {
      console.error('Error in RabbitMQ consumer:', error);
    }
  }

  private async _processBusinessOwnerData(data: any) {
    try {
    
      if (data.subscriptionData) {
        await this._businessOwnerService.addSubscription(data.subscriptionData);
      }
    } catch (err) {
      console.error('Error processing businessOwner data:', err);
      throw err;
    }
  }
}