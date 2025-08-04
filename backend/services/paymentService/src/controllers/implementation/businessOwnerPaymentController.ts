import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import IBusinessOwnerPaymentController from "../interface/IBusinessOwnerPaymentController";
import IBusinessOwnerPaymentService from "../../service/interface/IBusinessOwnerPaymentService";
import { CustomRequest } from "../../middlewares/authMiddleware";
import Stripe from "stripe";
import { HttpStatusCode } from "../../utils/enums";

@injectable()
export default class BusinessOwnerPaymentController
  implements IBusinessOwnerPaymentController {
  constructor(
    @inject("IBusinessOwnerPaymentService")
    private _businessOwnerPaymentService: IBusinessOwnerPaymentService
  ) {}

  async getAllSubscriptionPlans(req: Request, res: Response): Promise<Response> {
    try {
      const payments = await this._businessOwnerPaymentService.getAllSubscriptionPlans();
      return payments
        ? res.status(HttpStatusCode.OK).json(payments)
        : res.status(HttpStatusCode.NOT_FOUND).json({ error: "No payments found" });
    } catch (error) {
      console.error("Error fetching payments:", error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  }

  async upgradePlan(req: CustomRequest, res: Response): Promise<Response> {
    const { plan } = req.body;
    const businessOwnerId = req.user?.businessOwnerData?._id;
    const email = req.user?.businessOwnerData?.personalDetails?.email;

    if (!businessOwnerId || !email) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Missing businessOwnerId or email." });
    }

    try {
      const result = await this._businessOwnerPaymentService.upgradePlan(businessOwnerId, email, plan);
      return result
        ? res.status(HttpStatusCode.OK).json({ message: "Plan upgraded successfully", result })
        : res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Failed to upgrade plan." });
    } catch (error) {
      console.error("Error upgrading plan:", error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  }

  async findBusinessOwner(businessOwnerId: string, res: Response): Promise<void> {
    try {
      const businessOwner = await this._businessOwnerPaymentService.findBusinessOwner(businessOwnerId);
      res.json(businessOwner);
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error fetching business owner" });
    }
  }

  async handleWebhook(req: CustomRequest, res: Response): Promise<Response> {
    
    const signature = req.headers["stripe-signature"];
    
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret || !req.body) {
      
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: "Missing webhook secret or body" });
    }

    try {
      const event = Stripe.webhooks.constructEvent(req.body as any, signature as string, webhookSecret);

      

      if (event.type ==='invoice.payment_succeeded') {
        const session = event.data.object;
        await this._businessOwnerPaymentService.handleWebhook(session);
        return res.status(HttpStatusCode.OK).json({ message: "Webhook processed successfully" });
      }

      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Invalid webhook event" });
    } catch (error) {
      console.error("Error processing webhook:", error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error processing webhook" });
    }
  }

  async createCheckoutSession(req: Request, res: Response): Promise<Response> {

    
    const { plan, amount, currency, email } = req.body;

    try {
      const result = await this._businessOwnerPaymentService.createCheckoutSession(plan, amount, currency, email);

     if (!result) {
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create checkout session' });
      }

      return res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create checkout session', error });
    }
  }
}
