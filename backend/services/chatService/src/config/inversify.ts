import { Container } from "inversify";

import IChatController from "../controllers/interface/IChatController";
import IChatService from "../service/interface/IChatService";
import IChatRepository from "../repository/interface/IChatRepository";


import ChatController from "../controllers/implementation/chatController";
import ChatService from "../service/implementation/chatService";
import ChatRepository from "../repository/implementation/chatRepository";

import {IChat} from "../entities/chatEntities"
import ChatModel from "../models/chatModel"

import IEmployee from "../entities/employeeEntities"
import EmployeeModel from "../models/employeeModel"

import { IBusinessOwnerDocument } from "../entities/businessOwnerEntities";
import { IManager } from "../entities/managerEntities";
import BusinessOwnerModel from "../models/businessOwnerModel";
import ManagerModel from "../models/managerModel";




const container = new Container();


container.bind<IChatController>("IChatController").to(ChatController);
container.bind<IChatService>("IChatService").to(ChatService);
container.bind<IChatRepository>("IChatRepository").to(ChatRepository);

container.bind<typeof ChatModel>("IChat").toConstantValue(ChatModel);
container.bind<typeof EmployeeModel>("IEmployee").toConstantValue(EmployeeModel);
container.bind<typeof BusinessOwnerModel>("IBusinessOwnerDocument").toConstantValue(BusinessOwnerModel);
container.bind<typeof ManagerModel>("IManager").toConstantValue(ManagerModel);




export default container;
