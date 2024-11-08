import {Router} from "express";
import container from "../config/inversify";
import ISubscriptionController from "../controllers/interface/ISubscriptionController";



const subscriptionRouter = Router();
const subscriptionController = container.get<ISubscriptionController>("ISubscriptionController");


subscriptionRouter.get("/fetch-all-subscriptions",(req,res,next)=>subscriptionController.fetchAllSubscriptions(req,res));
subscriptionRouter.post("/add-subscriptions",(req,res,next)=>subscriptionController.addSubscription(req,res));
subscriptionRouter.patch('/update-isactive/:id', (req, res, next) => subscriptionController.updateIsActive(req, res,));
subscriptionRouter.put('/update-subscriptiondetiles/:id', (req, res, next) => subscriptionController.updateSubscriptionDetails(req, res,));





export default subscriptionRouter;