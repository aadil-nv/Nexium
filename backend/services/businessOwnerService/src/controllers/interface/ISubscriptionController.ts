import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";

export default interface ISubscriptionController {
    getSubscription(req: CustomRequest, res: Response): Promise<Response>;
    getAllSubscriptions(req: CustomRequest, res: Response): Promise<Response>;
    getInvoices(req: CustomRequest, res: Response): Promise<Response>;
}