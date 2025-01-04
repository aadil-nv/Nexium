import BaseRepository from "repository/implementation/baseRepository";
import {IChat} from "../../entities/chatEntities";
import IBaseRepository from "./IBaseRepository";
import IEmployee from "../../entities/employeeEntities";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntities";
import { IManager } from "../../entities/managerEntities";

export default interface IChatRepository extends BaseRepository<IChat>{
    createChat(chat: any): Promise<IChat>
    findAllEmployees(): Promise<IEmployee[]>
    findAllManagers(): Promise<IManager[]>
    findAllBusinessOwners(): Promise<IBusinessOwnerDocument[]>
}
