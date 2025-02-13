import {IChatResponseDTO, IGetAllGroupsDTO, IGroupDTO, IPrivateChatDTO, IReceiverDTO, IResponseDTO, ISetNewAccessTokenDTO, IUnAddedUsersDTO} from "../../dto/chatDTO"

export default  interface IChatService {
    getAllReceiver(myId: string , businessOwnerId: string): Promise<IReceiverDTO[]>
    getAllGroups(myId: string,businessOwnerId: string): Promise<IGetAllGroupsDTO[]>
    getAllPrivateChats(myId: string ,businessOwnerId: string): Promise<IPrivateChatDTO[]>
    createChat( myId: string, receiverId: string ,businessOwnerId: string): Promise<IChatResponseDTO>;
    createMessage(message: IChatResponseDTO, myId: string ,businessOwnerId: string): Promise<IChatResponseDTO>;
    createGroup(myId: string ,data: any ,businessOwnerId: string): Promise<IChatResponseDTO>;
    findChatId(myId: string, receiverId: string, chatType: string ,businessOwnerId: string): Promise<any>
    getChatParticipants(chatId: string,businessOwnerId: string): Promise<any> 
    getAllGroupMembers(groupId: string,businessOwnerId: string): Promise<any>
    getGroupDetails(groupId: string ,businessOwnerId: string): Promise<IGroupDTO>
    getAllUnAddedUsers(groupId: string, myId: string , businessOwnerId: string): Promise<IUnAddedUsersDTO[]>
    updateGroup(groupId: string, data: any,businessOwnerId: string): Promise<IGroupDTO>
    deleteGroup(groupId: string,businessOwnerId: string ): Promise<any>
    updateLastSeen(userId: string ,businessOwnerId: string): Promise<IResponseDTO>
    
    setNewAccessToken(refreshToken: string): Promise<ISetNewAccessTokenDTO>
}