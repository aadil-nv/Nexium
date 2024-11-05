import amqp from 'amqplib';
import { inject, injectable } from 'inversify';
import IConsumer from 'entities/consumerEntities';
import IBusinessOwnerService from 'service/interface/IBusinessOwnerService';

@injectable()
export default  class BusinessOwnerConsumer implements IConsumer  {
    private businessOwnerService:IBusinessOwnerService;
    constructor(@inject("IBusinessOwnerService") businessOwnerService:IBusinessOwnerService) {
        this.businessOwnerService = businessOwnerService;
    }

  async receiveFromQueue() {
    const queue = 'superadminQueue';
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
      const channel = await connection.createChannel();

      await channel.assertQueue(queue, { durable: true });
      console.log('Waiting for messages in superadminQueue...');

      channel.consume(queue, async (msg) => {
        if (msg !== null) {
          const businessOwnerData = JSON.parse(msg.content.toString());
          await this.businessOwnerService.registerBusinessOwner(businessOwnerData);
          channel.ack(msg);
        }
      });
    } catch (error) {
      console.error('Error in RabbitMQ consumer:', error);
    }
  }
}