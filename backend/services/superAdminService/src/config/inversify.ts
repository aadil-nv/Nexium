import { Container } from "inversify";


import  IBusinessOwnerController  from "../controllers/interface/IBusinessOwnerController";
import  BusinessOwnerController  from "../controllers/implementation/businessOwnerController";

import  IBusinessOwnerService  from "../service/interface/IBusinessOwnerService";
import  BusinessOwnerService from "../service/implementation/businessOwnerService";

import  IBusinessOwnerRepository  from "../repository/interface/IBusinessOwnerRepository";
import  BusinessOwnerRepository  from "../repository/implementation/businessOwnerRepository";
import  BusinessOwnerConsumer  from "../events/rabbitmq/consumers/consumer";
import IConsumer from "../entities/consumerEntities";





const container = new Container();  


container.bind<IBusinessOwnerController>("IBusinessOwnerController").to(BusinessOwnerController);
container.bind<IBusinessOwnerService>("IBusinessOwnerService").to(BusinessOwnerService);
container.bind<IBusinessOwnerRepository>("IBusinessOwnerRepository").to(BusinessOwnerRepository);
container.bind<BusinessOwnerConsumer>("IConsumer").to(BusinessOwnerConsumer);


export default container