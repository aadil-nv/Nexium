import BaseRepository from "repository/implementation/baseRepository";
import {IChat} from "../../entities/chatEntities";
import IBaseRepository from "./IBaseRepository";
import IEmployee from "../../entities/employeeEntities";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntities";
import { IManager } from "../../entities/managerEntities";
import { IMessage } from "../../entities/messageEntities";
import { IChatWithDetails, IChatWithGroupDetails } from "dto/chatDTO";

export default interface IChatRepository extends BaseRepository<IChat>{
    createChat( myId: string, receiverId: string): Promise<IChat>
    createMessage(message: any , myId: string): Promise<IMessage>
    createGroup(data: any, myId: string): Promise<IChat>
    findAllEmployees(): Promise<IEmployee[]>
    findAllManagers(): Promise<IManager[]>
    findAllBusinessOwners(): Promise<IBusinessOwnerDocument[]>
    findAllGroups(myId: string): Promise<IChat[]>
    findAllPrivateChats(userId: string): Promise<IChatWithDetails[]>
    findChatId(myId: string, receiverId: string, chatType: string): Promise<IChat>
    getChatParticipants(chatId: string): Promise<any> 
    getAllGroupMembers(groupId: string): Promise<IChatWithGroupDetails>
    getGroupDetails(groupId: string): Promise<IChatWithGroupDetails>
    getAllUnAddedUsers(groupId: string): Promise<any>
    updateGroup(groupId: string, data: any): Promise<IChatWithGroupDetails>
    deleteGroup(groupId: string): Promise<void>
}
