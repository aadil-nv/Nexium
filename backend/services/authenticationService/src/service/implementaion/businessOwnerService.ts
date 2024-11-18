import {IBusinessOwnerDocument,ITokenResponse,IPaymentIntentResponse,ISubscription,IOtpValidationResult} from "../interfaces/IBusinessOwnerService";
import bcrypt from "bcryptjs";
import {generateAccessToken,generateRefreshToken,} from "../../utils/businessOwnerJWT";
import mongoose from "mongoose";
import businessOwnerSchema from "../../model/businessOwnerModel";
import generateOtp from "../../utils/otp";
import nodemailer from "nodemailer";
import otpModel from "../../model/otpModel";
import Stripe from "stripe"
import IBusinessOwnerService from "../interfaces/IBusinessOwnerService";
import IBusinessOwnerRepository from "repository/interfaces/IBusinessOwnerRepository";
import { inject, injectable } from "inversify";
import sendToSuperAdmin from "../../events/rabbitmq/producers/producer";
import RabbitMQMessager from "../../events/rabbitmq/producers/producer";
import { IBusinessOwner } from "controllers/interface/IBusinessOwnerController";
import { generateOtpMail } from "../../utils/generateOtpMail";



const stripe = new Stripe(process.env.STRIP_SECRET_KEY as string);

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,},
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

            if (!emailRegex.test(email)) return { success: false, message: "Invalid email format" };
            if (!passwordRegex.test(password)) return { success: false, message: "Password must be at least 6 characters, 1 uppercase letter, 1 number, and 1 special character" };
    
            const businessOwnerData = await this.businessOwnerRepository.findByEmail(email);
            if (!businessOwnerData || !(await bcrypt.compare(password, businessOwnerData.password))) 
                return { success: false, message: "Invalid email or password" };
            if (!businessOwnerData.isVerified) {
                const otp = generateOtp();
                await this.sendOtp(businessOwnerData.email, otp);
                return { success: false, message: "Account not verified. Check your email for OTP", isVerified:false, email: businessOwnerData.email };
            }
    
            const accessToken = generateAccessToken({ businessOwnerData });
            const refreshToken = generateRefreshToken({ businessOwnerData });
    
            return { success: true, message: "Login successful", accessToken, refreshToken, isVerified: true, email: businessOwnerData.email };
    
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: "An error occurred during login" };
        }
    }
    
    async register(businessOwnerData: Partial<IBusinessOwner>): Promise<{ success?: boolean; message?: string; email?: string }> {

        try {
            if (businessOwnerData.password) {
                businessOwnerData.password = await bcrypt.hash(businessOwnerData.password, 10);
            }
    
            if (!businessOwnerData.companyName || !businessOwnerData.email) {
                throw new Error("Company name and email are required");
            }
    
            const existingBusinessOwner = await this.businessOwnerRepository.findByEmail(businessOwnerData.email ?? "");
    
            if (existingBusinessOwner) {
                throw new Error("Email already exists");
            }
            const newBusinessOwnerData: IBusinessOwnerDocument = new businessOwnerSchema({
                _id: new mongoose.Types.ObjectId(),
                companyName: businessOwnerData.companyName,
                businessOwnerName: "",
                email: businessOwnerData.email,
                address: "", 
                password: businessOwnerData.password,
                phone: businessOwnerData.phone,
                website: "",
                registrationNumber: "",
                isVerified: false,
                companyLogo: "https://example.com/default-logo.png",
                profileImage: "https://example.com/default-profile.png",
            });
    
            const businessOwner = await this.businessOwnerRepository.create(newBusinessOwnerData);
            const businessOwnerName = `${businessOwner._id}`;
            const businessOwnerDB = mongoose.connection.useDb(businessOwnerName);
    
            await businessOwnerDB.createCollection("users")
            const otp = generateOtp();
            await this.sendOtp(businessOwner.email, otp);
            return {email: businessOwner.email , success:true};
    
        } catch (error) {
            console.error("Error registering business owner:", error);
            return {message: error instanceof Error ? error.message : "Unknown error occurred",};
        }
    }
    
    
    async sendOtp(email: string, otp: string): Promise<void> {
        const otpRecord = new otpModel({
            email: email,
            otp: otp,
            createdAt: new Date(),});
    
        await otpRecord.save();
    
        const currentDate = new Date().toLocaleString(); 
        const expirationTime = "10 minutes"; 
    
        const mailOptions = generateOtpMail(email, otp, expirationTime);
    
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("OTP email sent: %s", info.messageId);
        } catch (error) {
            console.error("Error sending OTP email:", error);
            throw new Error("Failed to send OTP. Please try again later.");
        }
    }
    
    async validateOtp(email: string, otp: string): Promise<any> {
    try {
        const otpData = await this.businessOwnerRepository.findOtpByEmail(email);
        if (!otpData) {throw new Error("Business owner not found");}
        if (otpData.otp == otp) {
            const verification = await this.businessOwnerRepository.updateVerificationStatus(email);

            if (!verification) {
                return { success: false }; 
            }

             return { success: true, email ,message:"OTP validated and company verified successfully"}; 
        } else {
            console.log("Invalid OTP provided.");
            throw new Error("Invalid OTP provided.");
        }

    } catch (error) {
        console.error("Error validating OTP:", error);
        return {message: error instanceof Error ? error.message : "Unknown error occurred",};
    }
    }
    
    async createCheckoutSession(plan: any, amount: number, currency: string, email: string): Promise<IPaymentIntentResponse> {
        try {
            const rabbitMQMessager = new RabbitMQMessager();
            await rabbitMQMessager.init();
    
            if (plan.planName === 'Trial') {
                return this.processTrialPlan(plan, email, rabbitMQMessager);
            }
    
            return this.processPaidPlan(plan, amount, currency, email, rabbitMQMessager);
    
        } catch (error) {
            console.error('Error in createCheckoutSession:', error);
            throw new Error('Failed to process the request: ' + error);
        }
    }
    
    private async processTrialPlan(plan: any, email: string, rabbitMQMessager: RabbitMQMessager): Promise<IPaymentIntentResponse> {
        const subscription: ISubscription = {
            subscriptionId: plan._id,
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days trial
            status: 'Active',
        };
    
        const businessOwnerData = await this.businessOwnerRepository.updateSubscriptionByEmail(email, subscription);
        if (!businessOwnerData) {
            throw new Error('Company not found');
        }
    
        const accessToken = generateAccessToken({ businessOwnerData });
        const refreshToken = generateRefreshToken({ businessOwnerData });
        rabbitMQMessager.sendToMultipleQueues({ businessOwnerData });
    
        return {
            message: 'Subscription updated successfully',
            success: true,
            role: businessOwnerData.role,
            planName: plan.planName,
            accessToken,
            refreshToken,
        };
    }
    
    private async processPaidPlan(plan: any, amount: number, currency: string, email: string, rabbitMQMessager: RabbitMQMessager): Promise<IPaymentIntentResponse> {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: currency,
                    product_data: { name: plan.planName, description: `Payment for ${plan.features} Plan` },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'http://localhost:5173/business-owner/dashboard',
            cancel_url: 'http://localhost:5173/plan',
        });
    
        console.log('Stripe Session Created:', session);
    
        const oldBusinessOwnerData = await this.businessOwnerRepository.findByEmail(email);
        if (!oldBusinessOwnerData) {
            throw new Error('Business owner not found');
        }
    
        if (!oldBusinessOwnerData.subscription||JSON.stringify(oldBusinessOwnerData.subscription) === '{}') {
            const subscription: ISubscription = {
                subscriptionId: plan._id,
                startDate: new Date(),
                endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
                status: 'Active',
            };
            await this.businessOwnerRepository.updateSubscriptionByEmail(email, subscription);
        }
        const businessOwnerData = await this.businessOwnerRepository.findByEmail(email);
        const accessToken = generateAccessToken({ businessOwnerData });
        const refreshToken = generateRefreshToken({ businessOwnerData });
        rabbitMQMessager.sendToMultipleQueues({ businessOwnerData });
    
        return { session, success: true, planName: plan.planName, accessToken, refreshToken };
    }
     
    async resendOtp(email: string): Promise<{ success: boolean; message: string }> {
        const otp = generateOtp();
        const existingOtp = await this.businessOwnerRepository.findOtpByEmail(email);
        
        if (existingOtp) {
            await this.businessOwnerRepository.updateOtp(email, otp);
            return { success: true, message: 'OTP updated successfully.' }; 
        } else {
            console.log("No existing OTP, creating a new one");
        }
        await this.sendOtp(email, otp);
        return { success: true, message: 'OTP has been sent successfully.' };
    }
    
    async forgotPassword(email: string): Promise<{ success: boolean; message: string; email?: string }> {
        try {
            const otp = generateOtp();
            const [existingBusinessOwner] = await Promise.all([this.businessOwnerRepository.findByEmail(email), ]);
    
            if (existingBusinessOwner) {
                console.log("Updating existing OTP:", existingBusinessOwner);
                await this.sendOtp(existingBusinessOwner.email, otp); 
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
        try {
            const existingBusinessOwner = await this.businessOwnerRepository.findByEmail(email);
            if (!existingBusinessOwner) {
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





