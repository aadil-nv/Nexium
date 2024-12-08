import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";

export default interface IBusinessOwnerPaymentController {
    getAllSubscriptionPlans(req: Request, res: Response): Promise<Response>;
    upgradePlan(req: CustomRequest, res: Response): Promise<Response>;
    findBusinessOwner(businessOwnerId: string, res: Response): Promise<void>;
    handleWebhook(req: Request, res: Response): Promise<Response>;
    createCheckoutSession(req: CustomRequest, res: Response): Promise<Response>;
}