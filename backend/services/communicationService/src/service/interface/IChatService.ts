import {IChatResponseDTO, IGetAllGroupsDTO, IGroupDTO, IPrivateChatDTO, IReceiverDTO, ISetNewAccessTokenDTO, IUnAddedUsersDTO} from "../../dto/chatDTO"

export default  interface IChatService {
    getAllReceiver(myId: string): Promise<IReceiverDTO[]>
    getAllGroups(myId: string): Promise<IGetAllGroupsDTO[]>
    getAllPrivateChats(myId: string): Promise<IPrivateChatDTO[]>
    createChat( myId: string, receiverId: string): Promise<IChatResponseDTO>;
    createMessage(message: IChatResponseDTO, myId: string): Promise<IChatResponseDTO>;
    createGroup(myId: string ,data: any): Promise<IChatResponseDTO>;
    setNewAccessToken(refreshToken: string): Promise<ISetNewAccessTokenDTO>
    findChatId(myId: string, receiverId: string, chatType: string): Promise<any>
    getChatParticipants(chatId: string): Promise<any> 
    getAllGroupMembers(groupId: string): Promise<any>
    getGroupDetails(groupId: string): Promise<IGroupDTO>
    getAllUnAddedUsers(groupId: string, myId: string): Promise<IUnAddedUsersDTO[]>
    updateGroup(groupId: string, data: any): Promise<IGroupDTO>
    deleteGroup(groupId: string): Promise<any>

}