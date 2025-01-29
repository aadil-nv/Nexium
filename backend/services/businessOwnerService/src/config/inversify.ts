import { Container } from "inversify";


import  BusinessOwnerController from "../controllers/implementation/businessOwnerController";
import IBusinessOwnerController from "../controllers/interface/IBusinessOwnerController";
import BusinessOwnerRepository from "../repository/implementation/businessOwnerRepository";
import IBusinessOwnerRepository from "../repository/interface/IBusinessOwnerRepository";
import  BusinessOwnerService  from "../service/implementation/businessOwnerService";
import IBusinessOwnerService from "../service/interface/IBusinessOwnerService";
import BaseRepository from "../repository/implementation/baseRepository";
import IBaseRepository from "../repository/interface/IBaseRepository";



import ManagerController from "../controllers/implementation/managerController";
import IManagerController from "../controllers/interface/IManagerController";
import ManagerService from "../service/implementation/managerService";
import IManagerService from "../service/interface/IManagerService";
import IManagerRepository from "../repository/interface/IManagerReopsitory";
import ManagerRepository from "../repository/implementation/managerRepository";

import IEmployeeService from "../service/interface/IEmployeeService";
import IEmployeeRepository from "../repository/interface/IEmployeeRepository";
import EmployeeService from "../service/implementation/employeeService";
import EmployeeRepository from "../repository/implementation/employeeRepository";
import IEmployeeController from "../controllers/interface/IEmployeeController";
import EmployeeController from "../controllers/implementation/employeeController";

import IConsumer from "../events/rabbitmq/interface/IConsumer";
import BusinessOwnerConsumer from "../events/rabbitmq/implementation/consumer";
import businessOwnerModel from "../models/businessOwnerModel";
import managerModel from "../models/managerModel";
import  ISubscription  from "../entities/subscriptionEntity";

import subscriptionModel from "../models/subscriptionModel";

import ISubscriptionController from "../controllers/interface/ISubscriptionController";
import ISubscriptionService from "../service/interface/ISubscriptionService";
import ISubscriptionRepository from "../repository/interface/ISubscriptionRepository";
import SubscriptionService from "../service/implementation/subscriptionService";
import SubscriptionController from "../controllers/implementation/subscriptionController";
import SubscriptionRepository from "../repository/implementation/subscriptionRepository";

import IDashboardController from "../controllers/interface/IDashBoardController";
import IDashboardService from "../service/interface/IDashboardService";
import DashboardController from "../controllers/implementation/dashboardController";
import DashboardService from "../service/implementation/dashboardService";



const container =new Container()

container.bind<IBusinessOwnerController>("IBusinessOwnerController").to(BusinessOwnerController)
container.bind<IBusinessOwnerService>("IBusinessOwnerService").to(BusinessOwnerService)
container.bind<IBusinessOwnerRepository>("IBusinessOwnerRepository").to(BusinessOwnerRepository)

container.bind<typeof businessOwnerModel>("BusinessOwnerModel").toConstantValue(businessOwnerModel);
container.bind<typeof managerModel>("managerModel").toConstantValue(managerModel);
container.bind<typeof subscriptionModel>("subscriptionModel").toConstantValue(subscriptionModel);



container.bind<IManagerController>("IManagerController").to(ManagerController);
container.bind<IManagerService>("IManagerService").to(ManagerService);
container.bind<IManagerRepository>("IManagerRepository").to(ManagerRepository)

container.bind<IEmployeeController>("IEmployeeController").to(EmployeeController);
container.bind<IEmployeeService>("IEmployeeService").to(EmployeeService);
container.bind<IEmployeeRepository>("IEmployeeRepository").to(EmployeeRepository);

container.bind<BusinessOwnerConsumer>("IConsumer").to(BusinessOwnerConsumer);


container.bind<ISubscriptionController>("ISubscriptionController").to(SubscriptionController);
container.bind<ISubscriptionService>("ISubscriptionService").to(SubscriptionService);
container.bind<ISubscriptionRepository>("ISubscriptionRepository").to(SubscriptionRepository);


container.bind<IDashboardController>("IDashboardController").to(DashboardController);
container.bind<IDashboardService>("IDashboardService").to(DashboardService);

export default container;