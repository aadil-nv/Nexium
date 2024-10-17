import { Request, Response } from "express";
import { CompanyService } from "../Services/implementaion/companyService";
import { ObjectId } from "mongodb"; // Ensure you import ObjectId for MongoDB document ID
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe (ensure your secret key is used)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

const companyService = new CompanyService();

export class CompanyController {
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

        const { tokens, message, email: registeredEmail } = await companyService.register(registrationData);

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
    console.log("compnayController login touched...");

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    try {
      const tokens = await companyService.login(email, password);
      return res.status(200).json({
        message: "Login successful",
        ...tokens,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(401).json({ message: error.message });
      }
      return res
        .status(401)
        .json({ message: "Login failed", error: "Unknown error occurred" });
    }
  }

  async validateOtp(req: Request, res: Response): Promise<Response> {
    console.log("Hitting validateOtp...");

    const { email, otp } = req.body;

    try {
        const response = await companyService.validateOtp(email, otp);
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

async createCheckoutSession(req: Request, res: Response): Promise<Response> {
  console.log("Hitting Stripe Checkout Session controller...");

  try {
      const { plan, amount, currency, email } = req.body;

      
      const result = await companyService.createCheckoutSession(plan, amount, currency, email);

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
}
