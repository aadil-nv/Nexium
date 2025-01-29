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

import { IMessage } from "../entities/messageEntities";
import MessageModel from "../models/messageModel";

;
import IMessageRepository from "../repository/interface/IMessageRepository";
import IMessageController from "../controllers/interface/IMessageController";
import IMessageService from "../service/interface/IMessageService";
import MessageRepository from "../repository/implementation/messageRepository";
import MessageController from "../controllers/implementation/messageController";
import MessageService from "../service/implementation/messageSerice";

import { INotification } from "../entities/notificationEntities";
import NotificationModel from "../models/notificationModel";

import INotificationRepository from "../repository/interface/INotificationRepository";
import INotificationService from "../service/interface/INotificationService";
import NotificationRepository from "../repository/implementation/notificationRepository";
import NotificationService from "../service/implementation/notificationService";
import INotificationController from "../controllers/interface/INotificationController";
import NotificationController from "../controllers/implementation/notificationController";


import {IMeeting} from "../entities/meetingEntities"
import MeetingModel from "../models/meetingModel"


import IMeetingRepository from "../repository/interface/IMeetingRepository";
import IMeetingService from "../service/interface/IMeetingService";
import IMeetingController from "../controllers/interface/IMeetingController";
import MeetingRepository from "../repository/implementation/meetingRepository";
import MeetingService from "../service/implementation/meetingService";
import MeetingController from "../controllers/implementation/meetingController";



const container = new Container();


container.bind<IChatController>("IChatController").to(ChatController);
container.bind<IChatService>("IChatService").to(ChatService);
container.bind<IChatRepository>("IChatRepository").to(ChatRepository);



container.bind<IMessageController>("IMessageController").to(MessageController);
container.bind<IMessageService>("IMessageService").to(MessageService);
container.bind<IMessageRepository>("IMessageRepository").to(MessageRepository);


container.bind<INotificationController>("INotificationController").to(NotificationController);
container.bind<INotificationService>("INotificationService").to(NotificationService);
container.bind<INotificationRepository>("INotificationRepository").to(NotificationRepository);


container.bind<IMeetingController>("IMeetingController").to(MeetingController);
container.bind<IMeetingService>("IMeetingService").to(MeetingService);
container.bind<IMeetingRepository>("IMeetingRepository").to(MeetingRepository);

container.bind<typeof ChatModel>("IChat").toConstantValue(ChatModel);
container.bind<typeof EmployeeModel>("IEmployee").toConstantValue(EmployeeModel);
container.bind<typeof BusinessOwnerModel>("IBusinessOwnerDocument").toConstantValue(BusinessOwnerModel);
container.bind<typeof ManagerModel>("IManager").toConstantValue(ManagerModel);
container.bind<typeof MessageModel>("IMessage").toConstantValue(MessageModel);
container.bind<typeof NotificationModel>("INotification").toConstantValue(NotificationModel);
container.bind<typeof MeetingModel>("IMeeting").toConstantValue(MeetingModel);




export default container;
