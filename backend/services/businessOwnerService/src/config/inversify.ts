import { Container } from "inversify";
import  BusinessOwnerController from "../controllers/implementation/businessOwnerController";
import IBusinessOwnerController from "../controllers/interface/IBusinessOwnerController";
import BusinessOwnerRepository from "../repository/implementation/businessOwnerRepository";
import IBusinessOwnerRepository from "../repository/interface/IBusinessOwnerRepository";
import  BusinessOwnerService  from "../service/implementation/businessOwnerService";
import IBusinessOwnerService from "../service/interface/IBusinessOwnerService";



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


const container =new Container()

container.bind<IBusinessOwnerController>("IBusinessOwnerController").to(BusinessOwnerController)
container.bind<IBusinessOwnerService>("IBusinessOwnerService").to(BusinessOwnerService)
container.bind<IBusinessOwnerRepository>("IBusinessOwnerRepository").to(BusinessOwnerRepository)



container.bind<IManagerController>("IManagerController").to(ManagerController);
container.bind<IManagerService>("IManagerService").to(ManagerService);
container.bind<IManagerRepository>("IManagerRepoitory").to(ManagerRepository)

container.bind<IEmployeeController>("IEmployeeController").to(EmployeeController);
container.bind<IEmployeeService>("IEmployeeService").to(EmployeeService);
container.bind<IEmployeeRepository>("IEmployeeRepository").to(EmployeeRepository);

container.bind<BusinessOwnerConsumer>("IConsumer").to(BusinessOwnerConsumer);




export default container;