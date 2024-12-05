import { inject,injectable } from "inversify";
import { Request, Response } from "express";
import ISubscriptionController from "../interface/ISubscriptionController";
import ISubscriptionService from "../../service/interface/ISubscriptionService";
import { CustomRequest } from "../../middlewares/authMiddleware";


@injectable()
export default class SubscriptionController implements ISubscriptionController {
    constructor(@inject("ISubscriptionService") private _subscriptionService: ISubscriptionService) { }
    async getSubscription(req: CustomRequest, res: Response): Promise<Response> {
        console.log("Controller: getSubscription =========================");
        
        try {
            const subscriptionId = req?.user?.businessOwnerData?.subscription?.subscriptionId
            console.log("subscriptionId============%%%%====&&&&==========",  req?.user);
            
            const response = await this._subscriptionService.getSubscription(subscriptionId as string);
            console.log("response==========================", response);
            
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getAllSubscriptions(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const response = await this._subscriptionService.getAllSubscriptions();
            console.log("response================456236ygtrewy34573456w5yt==========", response);
            
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}