import {Router} from "express";
import  container  from "../config/inversify";
import  IBusinessOwnerPaymentController  from "../controllers/interface/IBusinessOwnerPaymentController";
import authenticateToken from "../middlewares/authMiddleware";


const businessOwnerPaymentController = container.get<IBusinessOwnerPaymentController>("IBusinessOwnerPaymentController")


const businessOwnerPaymentRoute = Router();

businessOwnerPaymentRoute.get("/make-payment",(req, res ,next) => businessOwnerPaymentController.getAllPayments(req, res));
businessOwnerPaymentRoute.post('/upgrade-plan',authenticateToken,(req, res, next) => businessOwnerPaymentController.upgradePlan(req, res));

export default businessOwnerPaymentRoute