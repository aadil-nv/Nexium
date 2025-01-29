import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import ISubscriptionController from "../interface/ISubscriptionController";
import ISubscriptionService from "../../service/interface/ISubscriptionService";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { HttpStatusCode } from "../../utils/enums";

@injectable()
export default class SubscriptionController implements ISubscriptionController {
    constructor(@inject("ISubscriptionService") private _subscriptionService: ISubscriptionService) {}

    async getSubscription(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const businessOwnerId = req?.user?.businessOwnerData?._id;
            const response = await this._subscriptionService.getSubscription(businessOwnerId as string);
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
        }
    }

    async getAllSubscriptions(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const response = await this._subscriptionService.getAllSubscriptions();
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
        }
    }

    async getInvoices(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const businessOwnerId = req?.user?.businessOwnerData?._id;
            const response = await this._subscriptionService.getInvoices(businessOwnerId as string);
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
        }
    }
}
