import { Container } from "inversify";
import  BusinessOwnerController from "../controllers/implementation/businessOwnerController";
import IBusinessOwnerController from "../controllers/interface/IBusinessOwnerController";
import BusinessOwnerRepository from "../repository/implementation/businessOwnerRepository";
import IBusinessOwnerRepository from "../repository/interface/IBusinessOwnerRepository";
import  BusinessOwnerService  from "../service/implementation/businessOwnerService";
import IBusinessOwnerService from "../service/interface/IBusinessOwnerService";
import SuperAdminController from "../controllers/implementation/superAdminController";
import ISuperAdminController from "../controllers/interface/ISuperAdminController";
import ISuperAdminService from "../service/interface/ISuperAdminService";
import SuperAdminService from "../service/implementation/superAdminService";
import SuperAdminRepositery from "../repository/implementation/superAdminRepository";
import ISuperAdminRepository from "../repository/interface/ISuperAdminRepository";


const container =new Container()

container.bind<IBusinessOwnerController>("IBusinessOwnerController").to(BusinessOwnerController)
container.bind<IBusinessOwnerService>("IBusinessOwnerService").to(BusinessOwnerService)
container.bind<IBusinessOwnerRepository>("IBusinessOwnerRepository").to(BusinessOwnerRepository)

container.bind<ISuperAdminController>("ISuperAdminController").to(SuperAdminController);
container.bind<ISuperAdminService>("ISuperAdminService").to(SuperAdminService);
container.bind<ISuperAdminRepository>("ISuperAdminRepository").to(SuperAdminRepositery)




export default container;