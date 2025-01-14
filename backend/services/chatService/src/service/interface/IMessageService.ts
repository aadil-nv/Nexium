import { IMessageDTO }  from "../../dto/messageDTO"

export default interface IMessageService {
    createMessage(senderId: string,chatId: string,message: any): Promise<IMessageDTO>
    getAllMessages(chatRoomId: string, myId: string ): Promise<IMessageDTO[]>
    deleteMessage(messageId: string): Promise<IMessageDTO>
}
