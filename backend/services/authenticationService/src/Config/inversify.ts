import {Container } from "inversify";

import ISuperAdminController from "../Controllers/interface/ISuperAdminController"
import SuperAdminController from "../Controllers/implementation/superAdminController"
import ISuperAdminService from "../Services/interfaces/ISuperAdminService"
import SuperAdminService from "../Services/implementaion/superAdminService"
import ISuperAdminRepository from "../Repositery/interfaces/ISuperAdminRepository";
import SuperAdminRepository from "../Repositery/implementaion/superAdminRepository";



const container = new Container();

container.bind<ISuperAdminController>("ISuperAdminController").to(SuperAdminController);
container.bind<ISuperAdminService>("ISuperAdminService").to(SuperAdminService);
container.bind<ISuperAdminRepository>("ISuperAdminRepository").to(SuperAdminRepository);

export default container;