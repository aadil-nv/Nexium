export default interface MessageRepository {
    sendToMultipleQueues(data: object, exchangeName: string, routingKeys: string[]): Promise<void>;
  }
  