import express, {Router, Request, Response } from 'express';
import { BusinessOwnerController } from '../Controllers/implementation/businessOwnerController';
import StripeWebhookController from '../hooks/StripeWebhook';


const businessOwnerRouter = Router();
const businessOwnerController = new BusinessOwnerController();


businessOwnerRouter.post('/login', async (req: Request, res: Response) => {
    await businessOwnerController.login(req, res);
});

businessOwnerRouter.post('/register', async (req: Request, res: Response) => {
    await businessOwnerController.register(req, res);
});

businessOwnerRouter.post('/otp-validation', async (req: Request, res: Response) => {
    await businessOwnerController.validateOtp(req, res);
});

businessOwnerRouter.post('/create-checkout-session', async (req: Request, res: Response) => {
    await businessOwnerController.createCheckoutSession(req, res);
});

businessOwnerRouter.post(
    '/webhook', 
    express.raw({ type: 'application/json' }), 
    StripeWebhookController.handleStripeWebhook.bind(StripeWebhookController)
  );
  
  export default businessOwnerRouter;
