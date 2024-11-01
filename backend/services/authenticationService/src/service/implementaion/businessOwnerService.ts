import {ICompany,ICompanyDocument,ITokenResponse,IPaymentIntentResponse,ISubscription,IOtpValidationResult} from "../interfaces/IBusinessOwnerService";
import bcrypt from "bcryptjs";
import {generateCompanyAccessToken,generateCompanyRefreshToken,} from "../../utils/businessOwnerJWT";
import mongoose from "mongoose";
import businessOwnerSchema from "../../model/businessOwnerModel";
import generateOtp from "../../utils/otp";
import nodemailer from "nodemailer";
import otpModel from "../../model/otpModel";
import Stripe from "stripe"
import IBusinessOwnerService from "../interfaces/IBusinessOwnerService";
import IBusinessOwnerRepository from "repository/interfaces/IBusinessOwnerRepository";
import { inject, injectable } from "inversify";



const stripe = new Stripe(process.env.STRIP_SECRET_KEY as string);

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

@injectable()
export default class BusinessOwnerService implements IBusinessOwnerService {
    private businessOwnerRepository: IBusinessOwnerRepository;

    constructor(@inject("IBusinessOwnerRepository") businessOwnerRepository: IBusinessOwnerRepository) {
        this.businessOwnerRepository = businessOwnerRepository;
    }


    async login(email: string, password: string): Promise<ITokenResponse> {
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    
            if (!emailRegex.test(email)) {
                return { success: false, message: "Invalid email format" };
            }
            if (!passwordRegex.test(password)) {
                return { success: false, message: "Password must have at least 6 characters, 1 uppercase letter, 1 number, and 1 special character" };
            }
    
            const company = await this.businessOwnerRepository.findByEmail(email);
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
    
            return {success: true,message: "Login successful",accessToken,refreshToken,};
    
        } catch (error) {
            return { success: false, message: "An error occurred during login"};
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

        const savedCompany = await this.businessOwnerRepository.create(newCompanyData);
        const companyDbName = `${savedCompany._id}`;
        const companyDb = mongoose.connection.useDb(companyDbName);

        await companyDb.createCollection("users").catch((err) => {
            if (err.codeName !== 'NamespaceExists') {
                throw err;
            }
        });


        const otp = generateOtp()

        await this.sendOtp(savedCompany.email,otp);

        // const tokens = this.generateTokens(savedCompany);

        return {
            // tokens,
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

async validateOtp(email: string, otp: string): Promise<any> {
    console.log("hitting validateOtp service", email, otp);
    
    try {
        const recordedCompany = await this.businessOwnerRepository.findOtpByEmail(email);

        if (!recordedCompany) {
            console.error("Company not found for email:", email);
            throw new Error("Company not found");
        }
        console.log("Recorded company:", recordedCompany);
        console.log("OTP:", otp);
        
        if (recordedCompany.otp == otp) {
            const verification = await this.businessOwnerRepository.updateVerificationStatus(email);

            if (!verification) {
                return { success: false }; 
            }
            
            ;

            console.log("OTP validated and company verified successfully.");
            
            

            return { success: true, email }; // Return the tokens if needed
        } else {
            console.log("Invalid OTP provided.");
            return { success: false };
        }
    } catch (error) {
        console.error("Error validating OTP:", error);
        return { success: false }; 
    }
}
        
    async createCheckoutSession(plan: any, amount: number, currency: string, email: string): Promise<IPaymentIntentResponse> {
      
        try {
          if (plan.id === 1) {
            const subscription: ISubscription = {
              planName: plan.name,
              planType: 'Trial',
              startDate: new Date(),
              endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Trial for 7 days
              status: 'Active',
            };
    
            const updatedCompany = await this.businessOwnerRepository.updateSubscriptionByEmail(email, subscription);
      
            if (updatedCompany) {
                console.log("Updated Company",updatedCompany);
                
                const accessToken = generateCompanyAccessToken({ updatedCompany });
                const refreshToken = generateCompanyRefreshToken({ updatedCompany })
              return { 
                message: 'Subscription updated successfully', 
                success: true, 
                role: updatedCompany.role,
                planId: plan.id, 
                accessToken,     
                refreshToken    
              };
            } else {
              throw new Error('Company not found');
            }
          } else {
            const session = await stripe.checkout.sessions.create({
              payment_method_types: ['card'],
              line_items: [{price_data: {currency: currency,product_data: { 
                name: plan.name,description: `Payment for ${plan.name} Plan`,
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
      
            const updatedCompany = await this.businessOwnerRepository.findByEmail(email);
            if (!updatedCompany) {
              throw new Error('Company not found');
            }
            
      
            return { session, success: true, planId: plan.id };
          }
        } catch (error) {
          console.error('Error in createCheckoutSession:', error);
          throw new Error('Failed to process the request: ' + error);  
        }
      }
      
  
    async resendOtp(email: string): Promise<{ success: boolean; message: string }> {
        console.log("resendOtp mail", email);
        
        const otp = generateOtp();
        const existingOtp = await this.businessOwnerRepository.getOtpByEmail(email);
        
        if (existingOtp) {
            console.log("Updating existing OTP:", existingOtp);
            await this.businessOwnerRepository.updateOtp(email, otp);
            return { success: true, message: 'OTP updated successfully.' }; 
        } else {
            console.log("No existing OTP, creating a new one");
        }
        
        await this.sendOtp(email, otp);
        
        return { success: true, message: 'OTP has been sent successfully.' };
    }
    
    
    async forgotPassword(email: string): Promise<{ success: boolean; message: string; email?: string }> {
        console.log("Hitting forgotPassword service for email:", email);
        
        try {
            const otp = generateOtp();
            
            // Using Promise.all to handle both operations concurrently
            const [existingBusinessOwner] = await Promise.all([
                this.businessOwnerRepository.findByEmail(email), // Database call
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
            const existingBusinessOwner = await this.businessOwnerRepository.findByEmail(email);
            if (!existingBusinessOwner) {
                console.log("No existing OTP, creating a new one");
                return { success: false, message: 'No existing OTP found for this email.' };
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await this.businessOwnerRepository.updatePassword(email, hashedPassword);
            return { success: true, message: 'Password updated successfully.' };
        } catch (error) {
            console.error("Error updating password:", error);
            return { success: false, message: 'Failed to update password. Please try again later.' };
        }
    }
      

}





