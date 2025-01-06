import {IChatResponseDTO, IGetAllGroupsDTO, IReceiverDTO, ISetNewAccessTokenDTO} from "../../dto/chatDTO"

export default  interface IChatService {
    getAllReceiver(myId: string): Promise<IReceiverDTO[]>
    getAllGroups(myId: string): Promise<IGetAllGroupsDTO[]>
    createChat( myId: string, receiverId: string): Promise<IChatResponseDTO>;
    createMessage(message: IChatResponseDTO, myId: string): Promise<IChatResponseDTO>;
    createGroup(myId: string ,data: any): Promise<IChatResponseDTO>;
    setNewAccessToken(refreshToken: string): Promise<ISetNewAccessTokenDTO>
}