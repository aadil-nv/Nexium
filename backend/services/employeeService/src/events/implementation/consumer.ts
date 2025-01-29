import amqp from 'amqplib';
import { inject, injectable } from 'inversify';
import IConsumer from '../interface/IConsumer';
import IEmployeeService from '../../service/interface/IEmployeeService';

@injectable()
export default class Consumer implements IConsumer {
  private _employeeService: IEmployeeService; // Declare _employeeService
  private _connection: amqp.Connection | null = null;
  private _channel: amqp.Channel | null = null;

  // Inject IManagerService and IEmployeeService in the constructor
  constructor(
    @inject("IEmployeeService") employeeService: IEmployeeService
  ) {
    this._employeeService = employeeService; // Initialize _employeeService
  }

  async receiveFromQueue() {
    const queue = 'authenticateQueue';
    const exchange = 'fanout_exchange';

    try {
      this._connection = await amqp.connect(process.env.RABBITMQ_URL as string);
      this._channel = await this._connection.createChannel();

      await this._channel.assertQueue(queue, { durable: true });
      await this._channel.assertExchange(exchange, 'fanout', { durable: true });

      console.log(`Waiting for messages in queue...`.bgRed.white.bold);

      this._channel?.bindQueue(queue, exchange, '');
      this._channel?.consume(queue, async (msg) => {
        if (msg !== null) {
          try {
            const data = JSON.parse(msg.content.toString());
            console.log("data ---------------QUEUE", data);


            // Check for employeeData and send it to the employee service
            // if (data.employeeData) {
            //   await this._employeeService.addEmployee(data.employeeData);
            // }

            this._channel?.ack(msg);
          } catch (err) {
            console.error('Error processing message:', err);
            this._channel?.nack(msg, false, true);
          }
        }
      });

      this._connection?.on('close', () => {
        console.log('RabbitMQ connection closed');
      });

      this._channel?.on('error', (err) => {
        console.error('Channel error:', err);
      });

    } catch (error) {
      console.error('Error in RabbitMQ consumer:', error);
    }
  }

  async shutdown() {
    try {
      if (this._channel) {
        await this._channel.close();
        console.log('Channel closed');
      }
      if (this._connection) {
        await this._connection.close();
        console.log('Connection closed');
      }
    } catch (error) {
      console.error('Error during shutdown:', error);
    }
  }
}
