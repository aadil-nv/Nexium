import {
    ICompany,
    ICompanyDocument,
    ITokenResponse,
    IPaymentIntentResponse,
    ISubscription
} from "../../entities/ICompany";
import CompanyRepository from "../../Repositery/implementaion/companyRepositery";
import bcrypt from "bcryptjs";
import {
    generateCompanyAccessToken,
    generateCompanyRefreshToken,
} from "../../Utils/companyJwt";
import mongoose from "mongoose";
import CompanyModel from "../../Schemas/companyRecordsSchema";
import generateOtp from "../../Utils/otp";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import otpModel from "../../Schemas/otpScheema";
dotenv.config();
import  {loadStripe}  from "@stripe/stripe-js";
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIP_SECRET_KEY as string);

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


export class CompanyService {
    private companyRepository: CompanyRepository;

    constructor() {
        this.companyRepository = new CompanyRepository();
    }

    async login(
        email: string, password: string): Promise<ITokenResponse> {
        const company = await this.companyRepository.findByEmail(email);
        if (!company) {
            throw new Error("Company not found");
        }

        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }

        return this.generateTokens(company);
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

        const existingCompany = await CompanyModel.findOne({
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

            await this.sendOtp(existingCompany.email);
            console.log("COMPANYDATA EMAIL", existingCompany.email);

            return { message: "true", email: existingCompany.email };
        }

        const companyDbName = `company_${companyData.registrationNumber}`;
        const companyDb = mongoose.connection.useDb(companyDbName);

        await companyDb.createCollection("users");

        const newCompanyData: ICompanyDocument = new CompanyModel({
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

        await this.sendOtp(savedCompany.email);

        const tokens = this.generateTokens(savedCompany);

        return {
            tokens,
            message: "true",
            email: savedCompany.email,
        };
    }

    async sendOtp(
        email: string): Promise<void> {
        const otp = generateOtp();
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

    async validateOtp(email: string, otp: string): Promise<{ success: boolean; email?: string }> {
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
    

        // async createCheckoutSession(plan: any, amount: number, currency: string): Promise<any> {
        //     console.log("Hitting Stripe Checkout Session Service", plan, amount, currency);
            
        //     try {
        //     const session = await stripe.checkout.sessions.create({
        //         payment_method_types: ['card'],
        //         line_items: [
        //         {
        //             price_data: {
        //             currency: currency,
        //             product_data: {
        //                 name: plan.name,
        //                 description: `Payment for ${plan.name} Plan`,
        //             },
        //             unit_amount: amount,
        //             },
        //             quantity: 1,
        //         },
        //         ],
        //         mode: 'payment', // One-time payment
        //         success_url: 'http://localhost:5173/company/dashboard', // Change to your actual success URL
        //         cancel_url: 'http://localhost:5173/plan', // Change to your actual cancel URL
        //     });
        
        //     return session; // Return session ID to the controller
        //     } catch (error) {
        //     console.error('Error creating Checkout Session:', error);
        //     throw new Error('Failed to create Checkout Session');
        //     }
        // }
        async createCheckoutSession(plan: any, amount: number, currency: string, email: string): Promise<any> {
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
      
}
