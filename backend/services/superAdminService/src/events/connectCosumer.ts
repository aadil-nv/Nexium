import IConsumer from "../entities/consumerEntities";
import container from "../config/inversify";

export const  connectConsumer = ()=>{
    const consumer = container.get<IConsumer>("IConsumer");
    consumer.receiveFromQueue().catch(() => console.log("Error starting rabbitmq consumer"));
}