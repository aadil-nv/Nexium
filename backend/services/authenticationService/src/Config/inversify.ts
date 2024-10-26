import {Container } from "inversify";

import ISuperAdminController from "../controllers/interface/ISuperAdminController"
import SuperAdminController from "../controllers/implementation/superAdminController"
import ISuperAdminService from "../service/interfaces/ISuperAdminService"
import SuperAdminService from "../service/implementaion/superAdminService"
import ISuperAdminRepository from "../repositery/interfaces/ISuperAdminRepository";
import SuperAdminRepository from "../repositery/implementaion/superAdminRepository";



const container = new Container();

container.bind<ISuperAdminController>("ISuperAdminController").to(SuperAdminController);
container.bind<ISuperAdminService>("ISuperAdminService").to(SuperAdminService);
container.bind<ISuperAdminRepository>("ISuperAdminRepository").to(SuperAdminRepository);

export default container;