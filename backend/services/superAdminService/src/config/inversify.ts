import { Container } from "inversify";


import  IBusinessOwnerController  from "../controllers/interface/IBusinessOwnerController";
import  BusinessOwnerController  from "../controllers/implementation/businessOwnerController";

import  IBusinessOwnerService  from "../service/interface/IBusinessOwnerService";
import  BusinessOwnerService from "../service/implementation/businessOwnerService";

import  IBusinessOwnerRepository  from "../repository/interface/IBusinessOwnerRepository";
import  BusinessOwnerRepository  from "../repository/implementation/businessOwnerRepository";
import  BusinessOwnerConsumer  from "../events/rabbitmq/consumers/consumer";
import IConsumer from "../entities/consumerEntities";

<<<<<<< HEAD
import SubscriptionController from "../controllers/implementation/subscriptionController";
import ISubscriptionController from "../controllers/interface/ISubscriptionController";
import ISubscriptionService from "../service/interface/ISubscriptionService";
import ISubscriptionRepository from "../repository/interface/ISubscriptionRepository";
import SubscriptionService from "../service/implementation/subscriptionService";
import SubscriptionRepository from "../repository/implementation/subscriptionRepository";
import IBaseRepository from "../repository/interface/IBaseRepository";
import BaseRepository from "../repository/implementation/baseRepository";
=======
>>>>>>> cc3e19bf05b3d09f1064503815fc8de7f3466ed0




const container = new Container();  


container.bind<IBusinessOwnerController>("IBusinessOwnerController").to(BusinessOwnerController);
container.bind<IBusinessOwnerService>("IBusinessOwnerService").to(BusinessOwnerService);
container.bind<IBusinessOwnerRepository>("IBusinessOwnerRepository").to(BusinessOwnerRepository);
container.bind<BusinessOwnerConsumer>("IConsumer").to(BusinessOwnerConsumer);


<<<<<<< HEAD
container.bind<ISubscriptionController>("ISubscriptionController").to(SubscriptionController);
container.bind<ISubscriptionService>("ISubscriptionService").to(SubscriptionService);
container.bind<ISubscriptionRepository>("ISubscriptionRepository").to(SubscriptionRepository);

container.bind<IBaseRepository>("IBaseRepository").to(BaseRepository);  





=======
>>>>>>> cc3e19bf05b3d09f1064503815fc8de7f3466ed0
export default container