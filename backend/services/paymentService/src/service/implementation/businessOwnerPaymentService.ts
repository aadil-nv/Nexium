import { inject, injectable } from "inversify";
import Stripe from "stripe";
import { Types } from "mongoose";
import IBusinessOwnerPaymentService from "../interface/IBusinessOwnerPaymentService";
import IBusinessOwnerPaymentRepository from "../../repository/interface/IBusinessOwnerPaymentRepository";
import { ISubscriptionDTO } from "../../dto/subscriptionDTO";
import { IBusinessOwnerDocument, ISubscription } from "../../entities/businessOwnerEntity";
import { IPaymentIntentResponseDTO } from "../../dto/businessOwnerPaymentsDTO";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";

const stripe = new Stripe(process.env.STRIP_SECRET_KEY as string);

@injectable()
export default class BusinessOwnerPaymentService implements IBusinessOwnerPaymentService {
  constructor(
    @inject("IBusinessOwnerPaymentRepository")
    private repository: IBusinessOwnerPaymentRepository
  ) {}

  async getAllSubscriptionPlans(): Promise<ISubscriptionDTO[]> {
    try {
      const payments = await this.repository.getAllSubscriptionPlans();
      return payments.map(({ _id, planName, description, price, planType, durationInMonths, features, isActive }) => ({
        _id, planName, description, price, planType, durationInMonths, features, isActive,
      }));
    } catch (error) {
      throw new Error("Error fetching payments: " + error);
    }
  }

  async findBusinessOwner(businessOwnerId: string): Promise<any> {
    try {
      const businessOwner = await this.repository.findBusinessOwner(businessOwnerId);
      if (!businessOwner) throw new Error("Business owner not found");
      return businessOwner;
    } catch (error) {
      throw new Error("Error fetching business owner: " + error);
    }
  }

  async upgradePlan(businessOwnerId: string, email: string, plan: any): Promise<any> {
    if (plan.planName !== "Trial") {
      return this.processPaidPlan(businessOwnerId, plan, email);
    }
  }

  private async processPaidPlan(businessOwnerId: string, plan: any, email: string): Promise<any> {

    console.log("businessOwnerId:", businessOwnerId);
    console.log("plan:", plan);
    console.log("email:", email);
    
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: plan.planName, description: `Payment for ${plan.features} Plan` },
              unit_amount: plan.price * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: "http://localhost:5173/business-owner/success",
        cancel_url: "http://localhost:5173/business-owner/subscriptions",
        payment_intent_data: {
          metadata: { planId: plan._id, email },
        },
      });
      if (!session) throw new Error("Failed to create Stripe session");
      return { session, success: true, planName: plan.planName };
    } catch (error) {
      throw new Error("Error processing payment: " + error);
    }
  }

  async handleWebhook(session: any): Promise<IBusinessOwnerDocument> {
      
    try {
      const { planId,email} = session.metadata;
      console.log("==============sessionId=============",session);
      
      if (!session.paid) throw new Error("Payment not successful");

      const businessOwner = await this.repository.findBusinessOwnerByEmail(email);
      if (businessOwner.subscription.subscriptionId === planId) {
        throw new Error("Already subscribed to this plan");
      }

      const newPlan = await this.repository.findNewSubscriptionPlan(planId);
      const subscription: ISubscription = {
        subscriptionId: new Types.ObjectId(newPlan[0]._id),
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        status: "Active",
      };

      return await this.repository.updateSubscriptionByEmail(email, subscription);
    } catch (error) {
      throw new Error("Error handling webhook: " + error);
    }
  }

  async createCheckoutSession(plan: any, amount: number, currency: string, email: string): Promise<IPaymentIntentResponseDTO> {
    try {

        if(!plan) throw new Error("Plan not found");

        const result = await this.processCheckoutPlan(plan, amount, currency, email);
        return result;

    } catch (error) {
        console.error('Error in createCheckoutSession:', error);
        throw new Error('Failed to process the request: ' + error);
    }
}

private async processCheckoutPlan(plan: any, amount: number, currency: string, email: string): Promise<IPaymentIntentResponseDTO> {
  const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
          price_data: {
              currency: currency,
              product_data: { name: plan.planName, description: `Payment for ${plan.features} Plan` },
              unit_amount: amount,
          },
          quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:5173/business-owner/success',
      cancel_url: 'http://localhost:5173/plan',
      payment_intent_data: {
        metadata: { planId: plan._id, email },
      }
  });

  console.log('Stripe Session Created:', session);

  // const oldBusinessOwnerData = await this.repository.findByEmail(email);
  // if (!oldBusinessOwnerData) {
  //     throw new Error('Business owner not found');
  // }
  // const businessOwnerId = oldBusinessOwnerData._id.toString();

  // console.log(`oldBusinessOwnerData: ${JSON.stringify(oldBusinessOwnerData)}`.bgCyan);
  // console.log(`%%%%%%%%%%%%%%%%%`.bgRed,oldBusinessOwnerData.subscription.status);

  // if (oldBusinessOwnerData.subscription.status == "Pending" ) {
  //     const subscription: ISubscription = {
  //         subscriptionId: plan._id,
  //         startDate: new Date(),
  //         endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
  //         status: 'Active',
  //     };
  //     await this.repository.updateSubscriptionById(businessOwnerId, subscription);
  // }
  // const businessOwnerData = await this.repository.findByEmail(email);
  // const accessToken = generateAccessToken({ businessOwnerData });
  // const refreshToken = generateRefreshToken({ businessOwnerData });

  return { session, success: true, message: 'Checkout session created successfully'};
}


}
