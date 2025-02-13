import BaseRepository from "repository/implementation/baseRepository";
import {IChat} from "../../entities/chatEntities";
import IBaseRepository from "./IBaseRepository";
import IEmployee from "../../entities/employeeEntities";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntities";
import { IManager } from "../../entities/managerEntities";
import { IMessage } from "../../entities/messageEntities";
import { IChatWithDetails, IChatWithGroupDetails } from "dto/chatDTO";

export default interface IChatRepository extends BaseRepository<IChat>{
    createChat( myId: string, receiverId: string, businessOwnerId: string): Promise<IChat>
    createMessage(message: any , myId: string ,businessOwnerId: string): Promise<IMessage>
    createGroup(data: any, myId: string ,businessOwnerId: string): Promise<IChat>
    findAllEmployees(businessOwnerId : string): Promise<IEmployee[]>
    findAllManagers(businessOwnerId : string): Promise<IManager[]>
    findAllBusinessOwners( businessOwnerId : string): Promise<IBusinessOwnerDocument[]>
    findAllGroups(myId: string ,businessOwnerId: string): Promise<IChat[]>
    findAllPrivateChats(userId: string ,businessOwnerId: string): Promise<IChatWithDetails[]>
    findChatId(myId: string, receiverId: string, chatType: string ,businessOwnerId: string): Promise<IChat>
    getChatParticipants(chatId: string ,businessOwnerId: string): Promise<any> 
    getAllGroupMembers(groupId: string, businessOwnerId: string): Promise<IChatWithGroupDetails>
    getGroupDetails(groupId: string ,businessOwnerId: string): Promise<IChatWithGroupDetails>
    getAllUnAddedUsers(groupId: string ,businessOwnerId: string): Promise<any>
    updateGroup(groupId: string, data: any ,businessOwnerId: string): Promise<IChatWithGroupDetails>
    deleteGroup(groupId: string ,businessOwnerId: string): Promise<void>
    updateLastSeenForChats(userId: string, businessOwnerId: string): Promise<any>
}
