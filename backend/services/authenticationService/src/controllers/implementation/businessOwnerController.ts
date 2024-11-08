import { Request, Response } from "express";
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

 async register(req: Request, res: Response): Promise<Response> {
    console.log("Hitting company controller...");

    const { companyName, registrationNumber, email, password, address, phone, website, documents } = req.body;

    if (!companyName || !registrationNumber || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const registrationData = {
          name: companyName,
          registrationNumber,
          email,
          password,
          address,
          phone,
          website,
          documents: documents || [],
          role: "BusinessOwner",
          subscription: {
              planName: "Trial",
              planType: "Trial",
              startDate: new Date(),
              endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
              status: "Active",
          },
        };

        const { message, email: registeredEmail } = await this.businessOwnerService.register(registrationData);

     
        return res.status(201).json({
            message: message || "Registration successful",
            email: registeredEmail,
        });

    } catch (error: unknown) {
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error occurred";
        return res.status(400).json({ message: errorMessage });
    }
}


async  login(req: Request, res: Response): Promise<Response> {
    console.log("hitiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Call the login function from the service
        const { success, message, accessToken, refreshToken, isVerified, email: companyEmail } = await this.businessOwnerService.login(email, password);

        if (!success) {
            if (isVerified === false) {
                return res.status(403).json({
                    message: "Account not verified. OTP sent to email.",
                    email: companyEmail,
                    isVerified: false,
                    success:success
                });
            }
            return res.status(400).json({ message });
        }

        return res.status(200).json({
            message,
            accessToken,
            refreshToken,
            email: companyEmail,
            isVerified: true
        });

    } catch (error: unknown) {
        return res.status(500).json({ message: "An error occurred during login" });
    }
}


async validateOtp(req: Request, res: Response): Promise<Response> {
    console.log("Hitting validateOtp...");

    const { email, otp } = req.body;

    try {
        const response = await this.businessOwnerService.validateOtp(email, otp);
        
        if (response.success) {
            return res.status(200).json({
                success: response.success,
                email: response.email,    
            });
        }

        return res.status(400).json({
            message: "Invalid OTP or verification failed. Please check and try again.",
        });
    } catch (error) {
        console.error("Error validating OTP:", error);

        return res.status(500).json({
            message: "OTP validation failed. Please try again later.",
        });
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

  try {
      const { plan, amount, currency, email } = req.body;

      const result = await this.businessOwnerService.createCheckoutSession(plan, amount, currency, email);

      

      if (result.planId === 1) {
  console.log("token is ", result.accessToken);
  
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7*24*6*60*1000, // 1 day
            sameSite: 'lax', // Necessary for cross-origin cookies
        });
          return res.status(200).json({
              message: result.message,  
              success: result.success,  
              role: result.role,       
              planId: result.planId,        
         
              
          });
      } else {
          
          return res.status(200).json({
              sessionId: result.session.id, 
              success: result.success,     
              planId: result.planId,    
            //   accessToken: result.accessToken,  
            //   refreshToken: result.refreshToken 
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
