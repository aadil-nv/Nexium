
import { Container } from "inversify";


// Interfaces
import IBusinessOwnerPaymentService from "../service/interface/IBusinessOwnerPaymentService";
import IBusinessOwnerPaymentRepository from "../repository/interface/IBusinessOwnerPaymentRepository";
import IBusinessOwnerPaymentController from "../controllers/interface/IBusinessOwnerPaymentController";

// Implementations
import BusinessOwnerPaymentService from "../service/implementation/businessOwnerPaymentService";
import BusinessOwnerPaymentRepository from "../repository/implementation/businessOwnerPaymentRepository";
import BusinessOwnerPaymentController from "../controllers/implementation/businessOwnerPaymentController";
import subscriptionModel from "../models/subscriptionModel";
import businessOwnerModel from "../models/businessOwnerModel";

const container = new Container();

// Bind Interfaces to Implementations
container.bind<IBusinessOwnerPaymentController>("IBusinessOwnerPaymentController").to(BusinessOwnerPaymentController);
container.bind<IBusinessOwnerPaymentRepository>("IBusinessOwnerPaymentRepository").to(BusinessOwnerPaymentRepository);
container.bind<IBusinessOwnerPaymentService>("IBusinessOwnerPaymentService").to(BusinessOwnerPaymentService);

container.bind<typeof subscriptionModel>("SubscriptionModel").toConstantValue(subscriptionModel);
container.bind<typeof businessOwnerModel>("BusinessOwnerModel").toConstantValue(businessOwnerModel);


export default container;
