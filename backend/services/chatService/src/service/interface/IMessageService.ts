import { IMessageDTO }  from "../../dto/messageDTO"

export default interface IMessageService {
    createMessage(req: any, res: any): Promise<IMessageDTO>;
}
