import express, { Request, Response } from 'express';
import { CompanyController } from '../Controllers/companyController';
import StripeWebhookController from '../hooks/StripeWebhook';




const companyRouter = express.Router();
const companyController = new CompanyController();


companyRouter.post('/login', async (req: Request, res: Response) => {
    await companyController.login(req, res);
});

companyRouter.post('/register', async (req: Request, res: Response) => {
    await companyController.register(req, res);
});

companyRouter.post('/otp-validation', async (req: Request, res: Response) => {
    await companyController.validateOtp(req, res);
});

companyRouter.post('/create-checkout-session', async (req: Request, res: Response) => {
    await companyController.createCheckoutSession(req, res);
});

companyRouter.post(
    '/webhook', 
    express.raw({ type: 'application/json' }), 
    StripeWebhookController.handleStripeWebhook.bind(StripeWebhookController)
  );
  
  export default companyRouter;
