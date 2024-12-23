import { Container } from "inversify";


import  IBusinessOwnerController  from "../controllers/interface/IBusinessOwnerController";
import  BusinessOwnerController  from "../controllers/implementation/businessOwnerController";

import  IBusinessOwnerService  from "../service/interface/IBusinessOwnerService";
import  BusinessOwnerService from "../service/implementation/businessOwnerService";

import  IBusinessOwnerRepository  from "../repository/interface/IBusinessOwnerRepository";
import  BusinessOwnerRepository  from "../repository/implementation/businessOwnerRepository";
import  BusinessOwnerConsumer  from "../events/rabbitmq/consumers/consumer";
import IConsumer from "../entities/consumerEntities";

import SubscriptionController from "../controllers/implementation/subscriptionController";
import ISubscriptionController from "../controllers/interface/ISubscriptionController";
import ISubscriptionService from "../service/interface/ISubscriptionService";
import ISubscriptionRepository from "../repository/interface/ISubscriptionRepository";
import SubscriptionService from "../service/implementation/subscriptionService";
import SubscriptionRepository from "../repository/implementation/subscriptionRepository";
import IBaseRepository from "../repository/interface/IBaseRepository";
import BaseRepository from "../repository/implementation/baseRepository";

import SuperAdminController from "../controllers/implementation/superAdminController";
import ISuperAdminController from "controllers/interface/ISuperAdminController";
import SuperAdminService from "../service/implementation/superAdminService";
import ISuperAdminService from "../service/interface/ISuperAdminService";
import ISuperAdminRepository from "../repository/interface/ISuperAdminRepository";
import SuperAdminRepository from "../repository/implementation/superAdminRepository";

import IDashboardController from "../controllers/interface/IDashboardController";
import IDashboardService from "../service/interface/IDashboardService";
import DashboardController from "../controllers/implementation/dashboardController";
import DashboardService from "../service/implementation/dashboardService";




const container = new Container();  


container.bind<IBusinessOwnerController>("IBusinessOwnerController").to(BusinessOwnerController);
container.bind<IBusinessOwnerService>("IBusinessOwnerService").to(BusinessOwnerService);
container.bind<IBusinessOwnerRepository>("IBusinessOwnerRepository").to(BusinessOwnerRepository);
container.bind<BusinessOwnerConsumer>("IConsumer").to(BusinessOwnerConsumer);


container.bind<ISubscriptionController>("ISubscriptionController").to(SubscriptionController);
container.bind<ISubscriptionService>("ISubscriptionService").to(SubscriptionService);
container.bind<ISubscriptionRepository>("ISubscriptionRepository").to(SubscriptionRepository);

container.bind<IBaseRepository>("IBaseRepository").to(BaseRepository);  

container.bind<ISuperAdminController>("ISuperAdminController").to(SuperAdminController);
container.bind<ISuperAdminService>("ISuperAdminService").to(SuperAdminService);
container.bind<ISuperAdminRepository>("ISuperAdminRepository").to(SuperAdminRepository);


container.bind<IDashboardController>("IDashboardController").to(DashboardController);
container.bind<IDashboardService>("IDashboardService").to(DashboardService);


export default container