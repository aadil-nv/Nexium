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
    console.log(`processPaidPlan====================================`.bgRed.bold);

    console.log("businessOwnerId:", businessOwnerId);
    console.log("plan:", plan);
    console.log("email:", email);
    
    try {

      const businessOwner = await this.repository.findBusinessOwnerByEmail(email);
      if (businessOwner && businessOwner.subscription.subscriptionId === plan._id) {
        console.log(`You are already subscribed to this plan.`.bgRed.bold);
        
        throw new Error("You are already subscribed to this plan.");
      }




      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: { 
              name: plan.planName, 
              description: `Payment for ${plan.features} Plan` 
            },
            unit_amount: plan.price,
            recurring: {
              interval: 'month', // Adjust to 'year' if your subscription is annual
            },
          },
          quantity: 1,
        }],
        mode: 'subscription',
        subscription_data: {
          metadata: { planId: plan._id, email },
        },
        success_url: 'http://localhost:5173/business-owner/success',
        cancel_url: 'http://localhost:5173/plan',
      });
      if (!session) throw new Error("Failed to create Stripe session");
      return { session, success: true, planName: plan.planName };
    } catch (error) {
      throw new Error("Error processing payment: " + error);
    }
  }

  async handleWebhook(session: any): Promise<IBusinessOwnerDocument> {

    console.log(`session: ${JSON.stringify(session.subscription_details)}`.bgCyan);
    
      
    try {
      const { planId,email} = session.subscription_details.metadata;

      console.log(`"==========Email========"`.bgRed,email);
      console.log(`"==========PlanId========"`.bgRed,planId);
      
      console.log("==============sessionId=============",session);

      console.log("==============Customer=============",session.customer);
      
      
      if (!session.paid) throw new Error("Payment not successful");

      const businessOwner = await this.repository.findBusinessOwnerByEmail(email);
      if (businessOwner.subscription.subscriptionId === planId) {
        throw new Error("Already subscribed to this plan");
      }
    

      const newPlan = await this.repository.findNewSubscriptionPlan(planId);
      const subscription: ISubscription = {
        subscriptionId: new Types.ObjectId(newPlan[0]._id),
        customerId: session.customer,
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
  console.log(`PROCesssssssssssssssssssssssssssssssssssssssssssssssssssssssss`.bgRed.bold);
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: currency,
        product_data: { 
          name: plan.planName, 
          description: `Payment for ${plan.features} Plan` 
        },
        unit_amount: amount,
        recurring: {
          interval: 'month', // Adjust to 'year' if your subscription is annual
        },
      },
      quantity: 1,
    }],
    mode: 'subscription',
    subscription_data: {
      metadata: { planId: plan._id, email },
    },
    success_url: 'http://localhost:5173/business-owner/success',
    cancel_url: 'http://localhost:5173/plan',
  });

  console.log('Stripe Session Created:', session);

  return { 
    session, 
    success: true, 
    message: 'Checkout session created successfully'
  };
}




}
