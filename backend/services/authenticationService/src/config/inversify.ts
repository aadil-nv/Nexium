import {Container } from "inversify";

import ISuperAdminController from "../controllers/interface/ISuperAdminController"
import SuperAdminController from "../controllers/implementation/superAdminController"
import ISuperAdminService from "../service/interfaces/ISuperAdminService"
import SuperAdminService from "../service/implementaion/superAdminService"
import ISuperAdminRepository from "../repository/interfaces/ISuperAdminRepository";
import SuperAdminRepository from "../repository/implementaion/superAdminRepository";

import IBusinessOwnerController from "../controllers/interface/IBusinessOwnerController";
import BusinessOwnerController from "../controllers/implementation/businessOwnerController";
import IBusinessOwnerService from "../service/interfaces/IBusinessOwnerService";
import BusinessOwnerService from "../service/implementaion/businessOwnerService";
import IBusinessOwnerRepository from "../repository/interfaces/IBusinessOwnerRepository";
import BusinessOwnerRepository from "../repository/implementaion/businessOwnerRepository";

import IManagerController from "../controllers/interface/IManagerController";
import ManagerController from "../controllers/implementation/managerController";
import IManagerService from "../service/interfaces/IManagerService";
import ManagerService from "../service/implementaion/managerService";
import IManagerRepository from "../repository/interfaces/IManagerRepository";
import ManagerRepository from "../repository/implementaion/managerRepository";
import IConsumer from "../events/rabbitmq/interface/IConsumer"; //! Do not remove it is using
import Consumer from "./../events/rabbitmq/consumer/consumer"

import BaseRepository from "../repository/implementaion/baseRepository";
import IBaseRepository from "../repository/interfaces/IBaseRepository";
import ManagerModel from "../model/managerModel";
import EmployeeModel from '../model/employeeModel';
import BusinessOwnerModel from '../model/businessOwnerModel';
import SuperAdminModel from '../model/superAdminModel';
import {IManager} from "../entities/managerEntities";


import IEmployeeController from "../controllers/interface/IEmployeeController";
import EmployeeController from "../controllers/implementation/employeeController";
import IEmployeeService from "../service/interfaces/IEmployeeService";
import EmployeeService from "../service/implementaion/employeeService";
import IEmployeeRepository from "../repository/interfaces/IEmployeeRepository";
import EmployeeRepository from "../repository/implementaion/employeeRepository";




const container = new Container();

container.bind<ISuperAdminController>("ISuperAdminController").to(SuperAdminController);
container.bind<ISuperAdminService>("ISuperAdminService").to(SuperAdminService);
container.bind<ISuperAdminRepository>("ISuperAdminRepository").to(SuperAdminRepository);

container.bind<IBusinessOwnerController>("IBusinessOwnerController").to(BusinessOwnerController);
container.bind<IBusinessOwnerService>("IBusinessOwnerService").to(BusinessOwnerService);
container.bind<IBusinessOwnerRepository>("IBusinessOwnerRepository").to(BusinessOwnerRepository);

container.bind<IManagerController>("IManagerController").to(ManagerController);
container.bind<IManagerService>("IManagerService").to(ManagerService);
container.bind<IManagerRepository>("IManagerRepository").to(ManagerRepository);

container.bind<Consumer>("IConsumer").to(Consumer);

// container.bind<IBaseRepository<IManager>>("IBaseRepository<IManager>").to(BaseRepository);

container.bind<typeof ManagerModel>("managerModel").toConstantValue(ManagerModel);
container.bind<typeof SuperAdminModel>("superAdminModel").toConstantValue(SuperAdminModel);
container.bind<typeof EmployeeModel>("employeeModel").toConstantValue(EmployeeModel);
container.bind<typeof BusinessOwnerModel>("businessOwnerModel").toConstantValue(BusinessOwnerModel);


container.bind<IEmployeeController>("IEmployeeController").to(EmployeeController);
container.bind<IEmployeeService>("IEmployeeService").to(EmployeeService);
container.bind<IEmployeeRepository>("IEmployeeRepository").to(EmployeeRepository);



export default container;