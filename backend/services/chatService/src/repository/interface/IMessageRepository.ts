import { IMessage } from "../../entities/messageEntities";
import IBaseRepository from "./IBaseRepository";


export default interface IMessageRepository extends IBaseRepository<IMessage> {
    createMessage(message: any, myId: string): Promise<IMessage>;
}