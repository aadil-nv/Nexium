import BaseRepository from "repository/implementation/baseRepository";
import {IChat} from "../../entities/chatEntities";
import IBaseRepository from "./IBaseRepository";
import IEmployee from "../../entities/employeeEntities";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntities";
import { IManager } from "../../entities/managerEntities";
import { IMessage } from "../../entities/messageEntities";

export default interface IChatRepository extends BaseRepository<IChat>{
    createChat( myId: string, receiverId: string): Promise<IChat>
    createMessage(message: any , myId: string): Promise<IMessage>
    createGroup(data: any, myId: string): Promise<IChat>
    findAllEmployees(myId: string): Promise<IEmployee[]>
    findAllManagers(): Promise<IManager[]>
    findAllBusinessOwners(): Promise<IBusinessOwnerDocument[]>
    findAllGroups(myId: string): Promise<IChat[]>
    findAllPrivateChats(myId: string): Promise<IChat[]>
    findChatId(myId: string, receiverId: string, chatType: string): Promise<IChat>
}
