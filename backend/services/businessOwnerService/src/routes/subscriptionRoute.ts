import container  from "../config/inversify";
import  { Router } from "express";
import ISubscriptionController from "../controllers/interface/ISubscriptionController";
import authenticateToken from "../middlewares/authMiddleware";


const subscriptionRouter = Router();
const subscriptionController = container.get<ISubscriptionController>("ISubscriptionController");   

subscriptionRouter.get('/get-subscription',authenticateToken ,(req, res, next) => subscriptionController.getSubscription(req, res));
subscriptionRouter.get('/get-all-subscriptions',authenticateToken ,(req, res, next) => subscriptionController.getAllSubscriptions(req, res));
subscriptionRouter.get('/invoices',authenticateToken ,(req, res, next) => subscriptionController.getInvoices(req, res));

export default subscriptionRouter