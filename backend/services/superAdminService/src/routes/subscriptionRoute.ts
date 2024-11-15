import {Router} from "express";
import container from "../config/inversify";
import ISubscriptionController from "../controllers/interface/ISubscriptionController";
import authenticateToken from "../middlewares/authMiddleware";



const subscriptionRouter = Router();
const subscriptionController = container.get<ISubscriptionController>("ISubscriptionController");


subscriptionRouter.get("/fetch-all-subscriptions",authenticateToken,(req,res,next)=>subscriptionController.fetchAllSubscriptions(req,res));
subscriptionRouter.post("/add-subscriptions",(req,res,next)=>subscriptionController.addSubscription(req,res));
subscriptionRouter.patch('/update-status/:id',authenticateToken, (req, res, next) => subscriptionController.updateIsActive(req, res,));
subscriptionRouter.put('/update-subscriptiondetiles/:id',authenticateToken, (req, res, next) => subscriptionController.updateSubscriptionDetails(req, res,));
subscriptionRouter.get('/get-subscription', (req, res, next) => subscriptionController.getSubscriptionDetails(req, res,));





export default subscriptionRouter;