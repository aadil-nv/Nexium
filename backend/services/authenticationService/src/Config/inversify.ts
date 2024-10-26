import {Container } from "inversify";

import ISuperAdminController from "../controllers/interface/ISuperAdminController"
import SuperAdminController from "../controllers/implementation/superAdminController"
import ISuperAdminService from "../service/interfaces/ISuperAdminService"
import SuperAdminService from "../service/implementaion/superAdminService"
import ISuperAdminRepository from "../repositery/interfaces/ISuperAdminRepository";
import SuperAdminRepository from "../repositery/implementaion/superAdminRepository";

import IBusinessOwnerController from "../controllers/interface/IBusinessOwnerController";
import BusinessOwnerController from "../controllers/implementation/businessOwnerController";
import IBusinessOwnerService from "../service/interfaces/IBusinessOwnerService";
import BusinessOwnerService from "../service/implementaion/businessOwnerService";
import IBusinessOwnerRepository from "../repositery/interfaces/IBusinessOwnerRepository";
import BusinessOwnerRepository from "../repositery/implementaion/businessOwnerRepository";



const container = new Container();

container.bind<ISuperAdminController>("ISuperAdminController").to(SuperAdminController);
container.bind<ISuperAdminService>("ISuperAdminService").to(SuperAdminService);
container.bind<ISuperAdminRepository>("ISuperAdminRepository").to(SuperAdminRepository);

container.bind<IBusinessOwnerController>("IBusinessOwnerController").to(BusinessOwnerController);
container.bind<IBusinessOwnerService>("IBusinessOwnerService").to(BusinessOwnerService);
container.bind<IBusinessOwnerRepository>("IBusinessOwnerRepository").to(BusinessOwnerRepository);


export default container;