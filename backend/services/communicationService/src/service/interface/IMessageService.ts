import { IMessageDTO }  from "../../dto/messageDTO"

export default interface IMessageService {
    createMessage(senderId: string,chatId: string,message: any, businessOwnerId: string): Promise<IMessageDTO>
    getAllMessages(chatRoomId: string, myId: string, businessOwnerId: string ): Promise<IMessageDTO[]>
    deleteMessage(messageId: string , businessOwnerId: string): Promise<IMessageDTO>
}
