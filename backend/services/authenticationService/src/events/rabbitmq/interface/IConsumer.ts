export default interface IConsumer {
    receiveFromQueue(): Promise<void>;
}
