import { inject, injectable } from "inversify";
import IBusinessOwnerPaymentService from "../interface/IBusinessOwnerPaymentService";
import IBusinessOwnerPaymentRepository from "../../repository/interface/IBusinessOwnerPaymentRepository";
import { ISubscriptionDTO } from "../../dto/subscriptionDTO";
import { IBusinessOwnerDocument, ISubscription } from "../../entities/businessOwnerEntity";
import Stripe from "stripe"
import { log } from "console";


const stripe = new Stripe(process.env.STRIP_SECRET_KEY as string);
@injectable()
export default class BusinessOwnerPaymentService implements IBusinessOwnerPaymentService {
    private _businessOwnerPaymentRepository: IBusinessOwnerPaymentRepository
  constructor(@inject("IBusinessOwnerPaymentRepository") businessOwnerPaymentRepository: IBusinessOwnerPaymentRepository) {
    this._businessOwnerPaymentRepository = businessOwnerPaymentRepository
  }

  async getAllPayments(): Promise<ISubscriptionDTO[]> {
    try {
      const payments: ISubscriptionDTO[] = await this._businessOwnerPaymentRepository.getAllPayments(); // Expect an array
      return payments.map((payment) => ({
        _id: payment._id,
        planName: payment.planName,
        description: payment.description,
        price: payment.price,
        planType: payment.planType,
        durationInMonths: payment.durationInMonths,
        features: payment.features,
        isActive: payment.isActive,
      }));
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  }

  async findBusinessOwner(businessOwnerId: string): Promise<any> {
    console.log("Inside findBusinessOwner service====================================");
    console.log('Business Owner ID:', businessOwnerId);
    try {
      const businessOwner = await this._businessOwnerPaymentRepository.findBusinessOwner(businessOwnerId); // Calling the method from the injected repository
      console.log('Fetched business owner:', businessOwner);
      if (!businessOwner) {
        throw new Error("Business owner not found");
      }
      return businessOwner;
    } catch (error) {
      console.error("Error fetching business owner service:", error);
      throw error;
    }
  }

  async upgradePlan(businessOwnerId: string, email: string , plan: any): Promise<any> {
    console.log("Inside upgradePlan controller====================================");
    console.log('Received plan:', plan);
    console.log('Business Owner ID:', businessOwnerId);
    
    
    try {
        

        if (plan.planName !== 'Trial') {
            return this.processPaidPlan(businessOwnerId, plan, plan.price, plan="usd", email);
        }


    } catch (error) {
        console.error('Error in createCheckoutSession:', error);
        throw new Error('Failed to process the request: ' + error);
    }

  }

  private async processPaidPlan(businessOwnerId: string, plan: any, amount: number, currency: string, email: string, ): Promise<any> {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: "usd",
                product_data: { name: plan.planName, description: `Payment for ${plan.features} Plan` },
                unit_amount: plan.price * 100,
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: 'http://localhost:5173/business-owner/dashboard',
        cancel_url: 'http://localhost:5173/plan',
    });

    console.log('Stripe Session Created:', session);


        if (!session) {
            throw new Error('Failed to create Stripe session');
        }
        const subscription: ISubscription = {
            subscriptionId: plan._id,
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
            status: 'Active',
        };
        await this._businessOwnerPaymentRepository.updateSubscriptionByEmail(businessOwnerId, subscription);
 
    // const businessOwnerData = await this._businessOwnerPaymentRepository.findByEmail(email);
  

    return { session, success: true, planName: plan.planName};
}
}
