import { Container } from "inversify";
import  BusinessOwnerController from "../controllers/implementation/businessOwnerController";
import IBusinessOwnerController from "../controllers/interface/IBusinessOwnerController";
import BusinessOwnerRepository from "../repository/implementation/businessOwnerRepository";
import IBusinessOwnerRepository from "../repository/interface/IBusinessOwnerRepository";
import  BusinessOwnerService  from "../service/implementation/businessOwnerService";
import IBusinessOwnerService from "../service/interface/IBusinessOwnerService";

const container =new Container()

container.bind<IBusinessOwnerController>("IBusinessOwnerController").to(BusinessOwnerController)
container.bind<IBusinessOwnerService>("IBusinessOwnerService").to(BusinessOwnerService)
container.bind<IBusinessOwnerRepository>("IBusinessOwnerRepository").to(BusinessOwnerRepository)



export default container;