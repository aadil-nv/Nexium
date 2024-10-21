import {
    ICompany,
    ICompanyDocument,
    ITokenResponse,
    IPaymentIntentResponse,
    ISubscription,
    IOtpValidationResult
} from "../interfaces/IBusinessOwnerService";
import businessOwnerRepository from "../../Repositery/implementaion/businessOwnerRepositery";
import bcrypt from "bcryptjs";
import {generateCompanyAccessToken,generateCompanyRefreshToken,} from "../../Utils/businessOwnerJWT";
import mongoose from "mongoose";
import businessOwnerSchema from "../../Schemas/businessOwnerSchema";
import generateOtp from "../../Utils/otp";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import otpModel from "../../Schemas/otpScheema";
dotenv.config();
import Stripe from "stripe"


const stripe = new Stripe(process.env.STRIP_SECRET_KEY as string);

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


export class BusinessOwnerService {
    private companyRepository: businessOwnerRepository;

    constructor() {
        this.companyRepository = new businessOwnerRepository();
    }

    // async login(email: string, password: string): Promise<ITokenResponse> {
    // try {
 
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    //     if (!emailRegex.test(email) || !passwordRegex.test(password)) {
    //         return { success: false, message: "Invalid credentials"};
    //     }

    //     const company = await this.companyRepository.findByEmail(email);
    //     if (!company ) {
    //         return {success: false, message: "Invalid credentials"};
    //     }
    //     if (!await bcrypt.compare(password, company.password)) {
    //         return { success: false,  message: "Invalid credentials" };
    //     }
    //     if ( !company.isVerified ) {
    //         const otp = generateOtp();
    //         await this.sendOtp(company.email, otp);
    //         return { email:company.email, success: false, message: "Account not verified. Please verify your email", isVerified:false };
    //     }

    //     const { accessToken, refreshToken } = this.generateTokens(company);

      
    //     return { 
    //         success: true, 
    //         message: "Login successful", 
    //         accessToken, 
    //         refreshToken 
    //     };

    // } catch (error) {
    //     // Catch any error and return the failure response
    //     return { 
    //         success: false, 
    //         message: "An error occurred during login", 
    //         accessToken: "", 
    //         refreshToken: "" 
    //     };
    // }
    // }
    async login(email: string, password: string): Promise<ITokenResponse> {
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    
            // Validate email and password format
            if (!emailRegex.test(email)) {
                return { success: false, message: "Invalid email format" };
            }
            if (!passwordRegex.test(password)) {
                return { success: false, message: "Password must have at least 6 characters, 1 uppercase letter, 1 number, and 1 special character" };
            }
    
            const company = await this.companyRepository.findByEmail(email);
            if (!company) {
                return { success: false, message: "Invalid email or password" };
            }
    
            const passwordMatch = await bcrypt.compare(password, company.password);
            if (!passwordMatch) {
                return { success: false, message: "Invalid email or password" };
            }
    
            if (!company.isVerified) {
                const otp = generateOtp();
                await this.sendOtp(company.email, otp);
                return { success: false, message: "Account not verified. Check your email for OTP", isVerified: false, email: company.email };
            }
    
            const { accessToken, refreshToken } = this.generateTokens(company);
    
            return {
                success: true,
                message: "Login successful",
                accessToken,
                refreshToken,
            };
    
        } catch (error) {
            return {
                success: false,
                message: "An error occurred during login",
                accessToken: "",
                refreshToken: ""
            };
        }
    }
    

    async register(
        companyData: Partial<ICompany>
    ): Promise<{ tokens?: ITokenResponse; message?: string; email?: string }> {
        if (companyData.password) {
            companyData.password = await bcrypt.hash(companyData.password, 10);
        }

        if (!companyData.registrationNumber) {
            throw new Error("Registration number is required");
        }

        const existingCompany = await businessOwnerSchema.findOne({
            $or: [
                { email: companyData.email },
                { phone: companyData.phone },
                { registrationNumber: companyData.registrationNumber },
            ],
        });

        if (existingCompany) {
            if (existingCompany.isVerified) {
                throw new Error("Credentials already used. Please check the details.");
            }
            const otp = generateOtp()
            await this.sendOtp(existingCompany.email,otp);
            console.log("COMPANYDATA EMAIL", existingCompany.email);

            return { message: "true", email: existingCompany.email };
        }

        const companyDbName = `company_${companyData.registrationNumber}`;
        const companyDb = mongoose.connection.useDb(companyDbName);

        await companyDb.createCollection("users");

        const newCompanyData: ICompanyDocument = new businessOwnerSchema({
            _id: new mongoose.Types.ObjectId(),
            name: companyData.name || "",
            email: companyData.email || "",
            address: companyData.address || "",
            password: companyData.password || "",
            phone: companyData.phone || "",
            website: companyData.website,
            registrationNumber: companyData.registrationNumber,
            documents: companyData.documents || [],
            subscription: companyData.subscription || {
                planName: "Trial",
                planType: "Trial",
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                status: "Active",
            },
            isVerified: false,
        });

        const savedCompany = await this.companyRepository.create(newCompanyData);
        const otp = generateOtp()

        await this.sendOtp(savedCompany.email,otp);

        const tokens = this.generateTokens(savedCompany);

        return {
            tokens,
            message: "true",
            email: savedCompany.email,
        };
    }

    async sendOtp(email: string, otp: string): Promise<void> {
        const otpRecord = new otpModel({
            email: email,
            otp: otp,
            createdAt: new Date(),
        });
    
        await otpRecord.save();
    
        const currentDate = new Date().toLocaleString(); // Format current date
        const expirationTime = "10 minutes"; // OTP expiration time
    
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP for Verification",
            text: `Your OTP for verification is ${otp}. It is valid for ${expirationTime}.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
                    <div style="text-align: center;">
                        <img src="Nexium" alt="Company Logo" style="width: 150px; height: auto; margin-bottom: 20px;" />
                    </div>
                    <h2 style="color: #333; text-align: center;">Your OTP for Verification</h2>
                    <p style="font-size: 16px; color: #555; text-align: center;">
                        Your OTP for verification is <strong style="font-size: 24px; color: #4CAF50;">${otp}</strong>.
                    </p>
                    <p style="font-size: 14px; color: #555; text-align: center;">
                        This OTP is valid for <strong style="color: #FF5722;">${expirationTime}</strong> from the time of request.
                    </p>
                    <p style="font-size: 14px; color: #888; text-align: center;">
                        Date: <strong>${currentDate}</strong>
                    </p>
                    <p style="font-size: 14px; color: #888; text-align: center;">
                        Please do not share this OTP with anyone.
                    </p>
                    <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
                        &copy; ${new Date().getFullYear()} Nexium All rights reserved.
                    </footer>
                </div>
            `,
        };
    
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("OTP email sent: %s", info.messageId);
        } catch (error) {
            console.error("Error sending OTP email:", error);
            throw new Error("Failed to send OTP. Please try again later.");
        }
    }
    
   
    generateTokens(
        company: ICompanyDocument): ITokenResponse {
        const accessToken = generateCompanyAccessToken(company);
        const refreshToken = generateCompanyRefreshToken(company);
        return { accessToken, refreshToken };
    }

    async validateOtp(
        email: string, otp: string): Promise<IOtpValidationResult> {
            console.log("hitting validateOtp service", email, otp);
            
        try {
            const recordedCompany = await this.companyRepository.findOtpByEmail(email);
    
            if (!recordedCompany) {
                console.error("Company not found for email:", email);
                throw new Error("Company not found");
            }
               console.log("Recorded company:", recordedCompany);
               console.log("OTP:", otp);
               
               
            if (recordedCompany.otp == otp) {
                const verification = await this.companyRepository.updateVerificationStatus(email);
    
                if (!verification) {
                    return { success: false }; // Verification failed
                }
                
    
                console.log("OTP validated and company verified successfully.");
                return { success: true, email  }; // Return success and email
            } else {
                console.log("Invalid OTP provided.");
                return { success: false }; // Invalid OTP
            }
        } catch (error) {
            console.error("Error validating OTP:", error);
            return { success: false }; // Error occurred
        }
    }
        
    //  async createCheckoutSession(
    //     plan: any, amount: number, currency: string, email: string): Promise<any> {
    //         console.log("Hitting Stripe Checkout Session Service", plan, amount, currency);
    
    //         try {
    //             if (plan.id === 1) {
    //                 // For Trial plan, update the subscription directly without Stripe
    //                 const subscription: ISubscription = {
    //                     planName: plan.name,
    //                     planType: 'Trial',
    //                     startDate: new Date(),
    //                     endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Trial for 7 days
    //                     status: 'Active',
    //                 };
    
    //                 // Update the company's subscription in the database
    //                 const updatedCompany = await this.companyRepository.updateSubscriptionByEmail(email, subscription);
    
    //                 if (updatedCompany) {
    //                     return { message: 'Subscription updated successfully', success: true  };
    //                 } else {
    //                     throw new Error('Company not found');
    //                 }
    //             } else {
    //                 // For other plans, proceed with Stripe Checkout
    //                 const session = await stripe.checkout.sessions.create({
    //                     payment_method_types: ['card'],
    //                     line_items: [
    //                         {
    //                             price_data: {
    //                                 currency: currency,
    //                                 product_data: {
    //                                     name: plan.name,
    //                                     description: `Payment for ${plan.name} Plan`,
    //                                 },
    //                                 unit_amount: amount,
    //                             },
    //                             quantity: 1,
    //                         },
    //                     ],
    //                     mode: 'payment',
    //                     success_url: 'http://localhost:5173/business-owner/dashboard',
    //                     cancel_url: 'http://localhost:5173/plan',
    //                 });
    
    //                 return session;
    //             }
    //         } catch (error) {
    //             console.error('Error in createCheckoutSession:', error);
    //             throw new Error('Failed to process the request: ' + error); // Include error message for clarity
    //         }
    // }
    async createCheckoutSession(
        plan: any, 
        amount: number, 
        currency: string, 
        email: string
      ): Promise<any> {
        console.log("Hitting Stripe Checkout Session Service", plan, amount, currency);
      
        try {
          if (plan.id === 1) {
            // For Trial plan, update the subscription directly without Stripe
            const subscription: ISubscription = {
              planName: plan.name,
              planType: 'Trial',
              startDate: new Date(),
              endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Trial for 7 days
              status: 'Active',
            };
      
            // Update the company's subscription in the database
            const updatedCompany = await this.companyRepository.updateSubscriptionByEmail(email, subscription);
      
            if (updatedCompany) {
                console.log("Updated Company",updatedCompany);
                
                const { accessToken, refreshToken } = this.generateTokens(updatedCompany);
              console.log("accesstoken is ",accessToken);
              console.log("refreshstoken is ",refreshToken);
              
      
              return { 
                message: 'Subscription updated successfully', 
                success: true, 
                role: updatedCompany.role,
                planId: plan.id,  // Send planId for trial plan
                accessToken,      // Include generated accessToken
                refreshToken      // Include generated refreshToken
              };
            } else {
              throw new Error('Company not found');
            }
          } else {
            // For other plans, proceed with Stripe Checkout
            const session = await stripe.checkout.sessions.create({
              payment_method_types: ['card'],
              line_items: [
                {
                  price_data: {
                    currency: currency,
                    product_data: {
                      name: plan.name,
                      description: `Payment for ${plan.name} Plan`,
                    },
                    unit_amount: amount,
                  },
                  quantity: 1,
                },
              ],
              mode: 'payment',
              success_url: 'http://localhost:5173/business-owner/dashboard',
              cancel_url: 'http://localhost:5173/plan',
            });
      
            // Generate access and refresh tokens for non-trial plans
            const updatedCompany = await this.companyRepository.findByEmail(email);
            if (!updatedCompany) {
              throw new Error('Company not found');
            }
            
            const { accessToken, refreshToken } = this.generateTokens(updatedCompany);
      
            // Return session, accessToken, refreshToken, and planId to the frontend
            return { 
              session, 
              success: true, 
              planId: plan.id,  // Send the planId
              accessToken,      // Include generated accessToken
              refreshToken      // Include generated refreshToken
            };
          }
        } catch (error) {
          console.error('Error in createCheckoutSession:', error);
          throw new Error('Failed to process the request: ' + error);  // Use error.message for better clarity
        }
      }
      
  
    async resendOtp(
        email: string): Promise<{ success: boolean; message: string }> {
        console.log("resendOtp mail", email);
        
        const otp = generateOtp();
        const existingOtp = await this.companyRepository.getOtpByEmail(email);
        
        if (existingOtp) {
            console.log("Updating existing OTP:", existingOtp);
            await this.companyRepository.updateOtp(email, otp); // Update existing OTP
            return { success: true, message: 'OTP updated successfully.' }; // Indicate successful update
        } else {
            console.log("No existing OTP, creating a new one");
            // Ensure you save a new OTP here
        }
        
        // Send the OTP via email
        await this.sendOtp(email, otp);
        
        return { success: true, message: 'OTP has been sent successfully.' };
    }
    
    
    async forgotPassword(email: string): Promise<{ success: boolean; message: string; email?: string }> {
        console.log("Hitting forgotPassword service for email:", email);
        
        try {
            const otp = generateOtp();
            
            // Using Promise.all to handle both operations concurrently
            const [existingBusinessOwner] = await Promise.all([
                this.companyRepository.findByEmail(email), // Database call
                // Optional: Cache the OTP or email sending service to reduce delays
            ]);
    
            if (existingBusinessOwner) {
                console.log("Updating existing OTP:", existingBusinessOwner);
                await this.sendOtp(existingBusinessOwner.email, otp); // This can be optimized further
                return { success: true, message: 'OTP sent successfully.', email: existingBusinessOwner.email }; 
            } else {
                console.log("No existing OTP, creating a new one");
                return { success: false, message: 'No existing account found for this email.' };
            }
            
        } catch (error) {
            console.error("Error sending OTP:", error);
            return { success: false, message: 'Failed to send OTP. Please try again later.' };
        }
    }
    

    async addNewPassword(email: string, password: string): Promise<{ success: boolean; message: string }> {
        console.log("hitting addNewPassword service", email, password);
        
        try {
            const existingBusinessOwner = await this.companyRepository.findByEmail(email);
            if (!existingBusinessOwner) {
                console.log("No existing OTP, creating a new one");
                return { success: false, message: 'No existing OTP found for this email.' };
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await this.companyRepository.updatePassword(email, hashedPassword);
            return { success: true, message: 'Password updated successfully.' };
        } catch (error) {
            console.error("Error updating password:", error);
            return { success: false, message: 'Failed to update password. Please try again later.' };
        }
    }
      

}





