import {
    ICompany,
    ICompanyDocument,
    ITokenResponse,
    IPaymentIntentResponse,
    ISubscription
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

    async login(email: string, password: string): Promise<ITokenResponse> {
    try {
 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

        if (!emailRegex.test(email) || !passwordRegex.test(password)) {
            return { success: false, message: "Invalid credentials", accessToken: "", refreshToken: "" };
        }

        const company = await this.companyRepository.findByEmail(email);
        if (!company ) {
            return { message: "Invalid credentials", accessToken: "", refreshToken: "" };
        }
        if (!await bcrypt.compare(password, company.password)) {
            return {  message: "Invalid credentials", accessToken: "", refreshToken: "" };
        }
        if ( !company.isVerified ) {
            const otp = generateOtp();
            await this.sendOtp(company.email, otp);
            return { email:company.email, success: false, message: "Account not verified. Please verify your email", accessToken: "", refreshToken: "" };
        }

        const { accessToken, refreshToken } = this.generateTokens(company);

      
        return { 
            success: true, 
            message: "Login successful", 
            accessToken, 
            refreshToken 
        };

    } catch (error) {
        // Catch any error and return the failure response
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

    

    async sendOtp(
        email: string,otp:string): Promise<void> {
       
        const otpRecord = new otpModel({
            email: email,
            otp: otp,
            createdAt: new Date(),
        });

        await otpRecord.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP for Verification",
            text: `Your OTP for verification is ${otp}. It is valid for 10 minutes.`,
            html: `<p>Your OTP for verification is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
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
        email: string, otp: string): Promise<{ success: boolean; email?: string }> {
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
                return { success: true, email }; // Return success and email
            } else {
                console.log("Invalid OTP provided.");
                return { success: false }; // Invalid OTP
            }
        } catch (error) {
            console.error("Error validating OTP:", error);
            return { success: false }; // Error occurred
        }
    }
        
     async createCheckoutSession(
        plan: any, amount: number, currency: string, email: string): Promise<any> {
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
                        return { message: 'Subscription updated successfully', success: true ,role:updatedCompany.role  };
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
                        success_url: 'http://localhost:5173/company/dashboard',
                        cancel_url: 'http://localhost:5173/plan',
                    });
    
                    return session;
                }
            } catch (error) {
                console.error('Error in createCheckoutSession:', error);
                throw new Error('Failed to process the request: ' + error); // Include error message for clarity
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
    
    
    async forgottPassword(email: string): Promise<{ success: boolean; message: string }> {
        console.log("hitting forgotPassword service", email);
        
       try {
        
        const otp = generateOtp();
        const existingBusinessOwner = await this.companyRepository.findByEmail(email);
        
        if (existingBusinessOwner) {
            console.log("Updating existing OTP:", existingBusinessOwner);
            await this.sendOtp(existingBusinessOwner.email, otp);
            return { success: true, message: 'OTP sent successfully.' }; 
        } else {
            console.log("No existing OTP, creating a new one");
            return { success: false, message: 'No existing OTP found for this email.' };
        }
        
        }catch (error) {
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





