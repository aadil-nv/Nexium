import {IChatResponseDTO, IReceiverDTO, ISetNewAccessTokenDTO} from "../../dto/chatDTO"

export default  interface IChatService {
    createChat(chat: IChatResponseDTO): Promise<IChatResponseDTO>;
    getAllReceiver(): Promise<IReceiverDTO[]>
    setNewAccessToken(refreshToken: string): Promise<ISetNewAccessTokenDTO>
}