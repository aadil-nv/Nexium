import { Request, Response } from "express";
import { BusinessOwnerService } from "../../Services/implementaion/businessOwnerService";
import { ObjectId } from "mongodb"; // Ensure you import ObjectId for MongoDB document ID
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe (ensure your secret key is used)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

const businessOwnerService = new BusinessOwnerService();

export class BusinessOwnerController {
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

        const { tokens, message, email: registeredEmail } = await businessOwnerService.register(registrationData);

        return res.status(201).json({
            message: message || "Registration successful",
            tokens,
            email: registeredEmail,
        });
    } catch (error: unknown) {
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error occurred";
        return res.status(400).json({ message: errorMessage });
    }
}


async login(req: Request, res: Response): Promise<Response> {
  console.log("companyController login touched...");

  try {
      const { email, password } = req.body;

      // Check if email or password is missing
      if (!email || !password) {
          return res.status(400).json({ message: "Email and password are required" });
      }

      // Attempt login
      const tokens = await businessOwnerService.login(email, password);

      // If login failed, return the failure message
      if (!tokens.success) {
          return res.status(401).json({ message: tokens.message });
      }

      // If login is successful, return tokens
      return res.status(200).json(tokens);

  } catch (error) {
      // Handle specific error messages or send a generic one
      return res.status(500).json({
          message: error instanceof Error ? error.message : "Login failed due to an unknown error",
      });
  }
}



  async validateOtp(req: Request, res: Response): Promise<Response> {
    console.log("Hitting validateOtp...");

    const { email, otp } = req.body;

    try {
        const response = await businessOwnerService.validateOtp(email, otp);
        console.log("Response from validateOtp:", response);

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
    const result = await businessOwnerService.resendOtp(email);
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

      
      const result = await businessOwnerService.createCheckoutSession(plan, amount, currency, email);

      if (plan.id === 1) {
          
          return res.status(200).json({ message: result.message, success: result.success });
      } else {
          
          return res.status(200).json({ sessionId: result.id });
      }
  } catch (error) {
      console.error('Error creating checkout session:', error);
      return res.status(500).json({ message: 'Failed to create checkout session' });
  }
}

async forgottPassword(req: Request, res: Response): Promise<Response> {
     console.log("Hitting forgotPassword controller...");
     
  try { 
    const { email } = req.body;
    const result = await businessOwnerService.forgottPassword(email);
    return res.status(200).json(result);
  } catch (error) { 
    console.error('Error resending OTP:', error);
    return res.status(500).json({ message: error || 'Internal Server Error' });
  }

}

async addNewPassword(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const result = await businessOwnerService.addNewPassword(email, password);
    return res.status(200).json(result);
}
}
