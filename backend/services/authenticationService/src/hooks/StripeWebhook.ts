import { Request, Response } from 'express';
import Stripe from 'stripe';
import { ISubscription } from "../controllers/interface/IBusinessOwnerController";
import businessOwnerRepository from "../repository/implementaion/businessOwnerRepository";
import mongoose from 'mongoose';

class StripeWebhookController {
  private stripe: Stripe;
  private businessOwnerRepository: businessOwnerRepository;

  constructor() {
    this.stripe = new Stripe(process.env.STRIP_SECRET_KEY!);
    this.businessOwnerRepository = new businessOwnerRepository();
  }

  public async handleStripeWebhook(req: Request, res: Response): Promise<void> {
    const sig = req.headers['stripe-signature']!;
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      console.log(`Webhook signature verification failed.`);
      res.status(400).send(`Webhook Error: ${err}`);
      return; // Ensure to return after sending the response
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_email;

      if (email) {
        const subscription: ISubscription = {
         subscriptionId:new  mongoose.Types.ObjectId(),
         
          startDate: new Date(),
          endDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
          status: 'Active',
        };

        try {
          const updatedCompany = await this.businessOwnerRepository.updateSubscriptionByEmail(email, subscription);

          if (updatedCompany) {
            console.log('Subscription updated successfully after payment.');
          } else {
            console.error('Company not found after successful payment.');
          }
        } catch (error) {
          console.error('Error updating subscription:', error);
          res.status(500).send('Internal server error.');
          return; // Ensure to return after sending the response
        }
      }
    }

    res.json({ received: true }); // Send a response indicating the webhook was received
  }
}

export default new StripeWebhookController();
