import {Router} from "express";
import  container  from "../config/inversify";
import  IBusinessOwnerPaymentController  from "../controllers/interface/IBusinessOwnerPaymentController";
import authenticateToken from "../middlewares/authMiddleware";


const businessOwnerPaymentController = container.get<IBusinessOwnerPaymentController>("IBusinessOwnerPaymentController")


const businessOwnerPaymentRoute = Router();

businessOwnerPaymentRoute.get("/make-payment",(req, res ,next) => businessOwnerPaymentController.getAllSubscriptionPlans(req, res));
businessOwnerPaymentRoute.post('/upgrade-plan',authenticateToken,(req, res, next) => businessOwnerPaymentController.upgradePlan(req, res));
businessOwnerPaymentRoute.post('/create-checkout-session',(req, res, next) => businessOwnerPaymentController.createCheckoutSession(req, res));

export default businessOwnerPaymentRoute