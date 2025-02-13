import { IMessage } from "../../entities/messageEntities";
import IBaseRepository from "./IBaseRepository";


export default interface    IMessageRepository extends IBaseRepository<IMessage> {
    createMessage(messageData: any ,businessOwnerId: string): Promise<IMessage>
    getAllMessages(chatRoomId: string , businessOwnerId: string ): Promise<IMessage[]> 
    deleteMessage(messageId: string , businessOwnerId: string): Promise<IMessage | null>  
   
}