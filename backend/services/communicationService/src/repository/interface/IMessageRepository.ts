import { IMessage } from "../../entities/messageEntities";
import IBaseRepository from "./IBaseRepository";


export default interface    IMessageRepository extends IBaseRepository<IMessage> {
    createMessage(message: any): Promise<IMessage>
    getAllMessages(chatRoomId: string ): Promise<IMessage[]> 
    deleteMessage(messageId: string): Promise<IMessage | null>  
   
}