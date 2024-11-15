import { NextFunction, Request, Response } from "express";
import { loadStripe } from '@stripe/stripe-js';
import IBusinessOwnerController from "../interface/IBusinessOwnerController";
import IBusinessOwnerService from "../../service/interfaces/IBusinessOwnerService";
import { inject, injectable } from "inversify";


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

@injectable()
export default class BusinessOwnerController implements IBusinessOwnerController   {
  
    private  businessOwnerService: IBusinessOwnerService;

    constructor( @inject("IBusinessOwnerService") businessOwnerService: IBusinessOwnerService) {
        this.businessOwnerService = businessOwnerService;
    }


   
async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
  
      const { success, message, accessToken, refreshToken, isVerified, email: companyEmail } =
        await this.businessOwnerService.login(email, password);
      console.log("success", success);
      if (!success) {
        if (!isVerified) {
          return res.status(400).json({ message: "Account not verified. OTP sent to email.", email: companyEmail, isVerified: false ,success:false });
        }
      
      }
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
  
      res.cookie('companyEmail', companyEmail, { httpOnly: true, secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
  
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
  
      return res.status(200).json({ accessToken, success, message });
    } catch (error) {
      console.error("Error during login", error);
      return res.status(500).json({ message: "An error occurred during login" });
    }
  } 

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("Hitting company controller...");
    
    try {
      const { companyName, email, password, phone } = req.body;
      const businessOwnerData = { companyName, email, password, phone };
      const { success,message, email: registeredEmail } = await this.businessOwnerService.register(businessOwnerData);
      res.status(201).json({message: message ,email: registeredEmail,success: success});

    } catch (error) {
        console.error("Error during registration:", error);
        next(error);  
    }
}


async validateOtp(req: Request, res: Response ,next: NextFunction): Promise<void> {
    console.log("Hitting validateOtp...");

    try {
        const { email, otp } = req.body;
        const response = await this.businessOwnerService.validateOtp(email, otp);
        res.status(200).json({success: response.success, email: response.email,});
       
    } catch (error) {
        console.error("Error validating OTP:", error);
        next(error);
}
}

async resendOtp(req: Request, res: Response): Promise<Response> {
  const { email } = req.body;

  try {
    const result = await this.businessOwnerService.resendOtp(email);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error resending OTP:', error);
    return res.status(500).json({ message: error || 'Internal Server Error' });
  }
}


async createCheckoutSession(req: Request, res: Response): Promise<Response> {
  console.log("Hitting Stripe Checkout Session controller...");
  console.log(`"Body data  from ---------------"`.bgMagenta);
  

  try {
      const { plan, amount, currency, email } = req.body;
      console.log("plan, amount, currency, email", plan, amount, currency, email);
      
      const result = await this.businessOwnerService.createCheckoutSession(plan, amount, currency, email);
   

      if (result.planName === "Trial") {
       
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge:7 * 24 * 60 * 60 * 1000,
            sameSite: 'lax', 
        });

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge:7 * 24 * 60 * 60 * 1000, 
            sameSite: 'lax',
        })
          return res.status(200).json({
              message: result.message,  
              success: result.success,  
              role: result.role,       
              planName: result.planName,        
         
              
          });
          console.log("result is coming $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", result);
          
      } else {
          
          return res.status(200).json({
              sessionId: result.session.id, 
              success: result.success,     
              planName: result.planName,    

          });
      }
  } catch (error) {
      console.error('Error creating checkout session:', error);
      return res.status(500).json({ message: 'Failed to create checkout session', error: error });
  }
}


async forgotPassword(req: Request, res: Response): Promise<Response> {
     console.log("Hitting forgotPassword controller...");
     
  try { 
    const { email } = req.body;
    const result = await this.businessOwnerService.forgotPassword(email);
    return res.status(200).json(result);
  } catch (error) { 
    console.error('Error resending OTP:', error);
    return res.status(500).json({ message: error || 'Internal Server Error' });
  }

}

async addNewPassword(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const result = await this.businessOwnerService.addNewPassword(email, password);
    return res.status(200).json(result);
}
}
