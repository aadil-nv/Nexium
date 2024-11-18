import { Request, Response } from "express";
import ISubscriptionService from "../../service/interface/ISubscriptionService";
import { inject, injectable } from "inversify";

@injectable()
export default class SubscriptionController {
  constructor(@inject("ISubscriptionService") private _subscriptionService: ISubscriptionService) {}

  async addSubscription(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this._subscriptionService.addSubscription(req.body);
      return res.status(result ? 201 : 400).json(result);
    } catch (error) {
      console.error("Error in controller:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  async fetchAllSubscriptions(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this._subscriptionService.fetchAllSubscriptions();
      return res.status(result ? 200 : 400).json(result);
    } catch (error) {
      console.error("Error in controller:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  async updateIsActive(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this._subscriptionService.updateIsActive(req.params.id);
      return res.status(result ? 200 : 400).json(result);
    } catch (error) {
      console.error("Error in controller:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  async updateSubscriptionDetails(req: Request, res: Response): Promise<Response> {
    try {
      const updateData = req.body;
      const result = await this._subscriptionService.updateSubscriptionDetails(req.params.id, updateData);
      return res.status(result ? 200 : 400).json(result);
    } catch (error) {
      console.error("Error in controller:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  async getSubscriptionDetails(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this._subscriptionService.fetchAllSubscriptions();
      return res.status(result ? 200 : 400).json(result);
    } catch (error) {
      console.error("Error in controller:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
}
