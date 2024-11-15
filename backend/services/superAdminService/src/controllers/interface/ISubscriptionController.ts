import { Request, Response } from "express";
export default interface ISubscription {
    addSubscription(req: Request, res: Response): Promise<Response>;
    fetchAllSubscriptions(req: Request, res: Response): Promise<Response>;
    updateIsActive(req: Request, res: Response): Promise<Response>;
    updateSubscriptionDetails(req: Request, res: Response): Promise<Response>;
    getSubscriptionDetails(req: Request, res: Response): Promise<Response>;
  
}