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
        }
      });
    } catch (error) {
      console.error('Error in RabbitMQ consumer:', error);
    }
  }
}