import {ITokenResponse,IPaymentIntentResponse,IOtpValidationResult} from "../interfaces/IBusinessOwnerService";
import {IBusinessOwnerDocument,ISubscription} from "../../entities/businessOwnerEntities";
import bcrypt from "bcryptjs";
import {generateAccessToken,generateRefreshToken,} from "../../utils/businessOwnerJWT";
import mongoose from "mongoose";
import generateOtp from "../../utils/otp";
import nodemailer from "nodemailer";
import otpModel from "../../model/otpModel";
import Stripe from "stripe"
import IBusinessOwnerService from "../interfaces/IBusinessOwnerService";
import IBusinessOwnerRepository from "repository/interfaces/IBusinessOwnerRepository";
import { inject, injectable } from "inversify";
import RabbitMQMessager from "../../events/rabbitmq/producers/producer";
import { IBusinessOwner } from "controllers/interface/IBusinessOwnerController";
import { generateOtpMail } from "../../utils/generateOtpMail";
import businessOwnerModel from "../../model/businessOwnerModel";
import { IGoogleResponseDTO, IResponseDTO } from "dto/managerDTO";




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
          // Validate email and password format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
      
          if (!emailRegex.test(email)) return { success: false, message: "Invalid email format" };
          if (!passwordRegex.test(password)) return { success: false, message: "Password must be at least 6 characters, 1 uppercase letter, 1 number, and 1 special character" };
      
          // Find the business owner by email
          const businessOwnerData = await this.businessOwnerRepository.findByEmail(email);
      
          if (!businessOwnerData || !(await bcrypt.compare(password, businessOwnerData.personalDetails.password))) {
            return { success: false, message: "Invalid email or password" };
          }
      
          // Check if the account is blocked
          if (businessOwnerData.isBlocked) {
            console.log("Account is blocked");
            return { success: false, message: "Your account has been blocked. Please contact support for assistance.", isVerified: false };
          }
      
          // Check if the account is verified
          if (!businessOwnerData.isVerified) {
            const otp = generateOtp();
            await this.sendOtp(businessOwnerData.personalDetails.email, otp);
          
            return {
              success: false,
              message: "Your account is not verified. An OTP has been sent to your email for verification.", 
              isVerified: false,
              email: businessOwnerData.personalDetails.email,
            };
          }
      
          // Generate and return tokens if login is successful
          const accessToken = generateAccessToken({ businessOwnerData });
          const refreshToken = generateRefreshToken({ businessOwnerData });
          if(businessOwnerData.personalDetails.profilePicture ){
              
            businessOwnerData.personalDetails.profilePicture = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${ businessOwnerData?.personalDetails?.profilePicture}`
          }
          if(businessOwnerData.companyDetails.companyLogo){
              
            businessOwnerData.companyDetails.companyLogo= `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${ businessOwnerData?.companyDetails?.companyLogo}`
          }
      
          return { 
            success: true, 
            message: "Login successful", 
            accessToken, 
            refreshToken, 
            isVerified: true,
            businessOwnerData, 
            email: businessOwnerData.personalDetails.email ,
            companyName:businessOwnerData.companyDetails.companyName,
            profilePicture:businessOwnerData.personalDetails.profilePicture,
            companyLogo:businessOwnerData.companyDetails.companyLogo,

          };
      
        } catch (error) {
          console.error("Login error:", error);
          return { success: false, message: "An error occurred during login" };
        }
      }
      
    
    async register(businessOwnerData: Partial<IBusinessOwner>): Promise<ITokenResponse> {
     
        try {
          // Hash password if it's provided
          if (businessOwnerData.password) {
            businessOwnerData.password = await bcrypt.hash(businessOwnerData.password, 10);
          }
      
          // Ensure company name and email are provided
          if (!businessOwnerData.companyName || !businessOwnerData.email) {
            throw new Error("Company name and email are required");
          }
      
          // Check if the business owner already exists
          const existingBusinessOwner = await this.businessOwnerRepository.findByEmail(businessOwnerData.email ?? "");
          if (existingBusinessOwner) {
            throw new Error("Email already exists");
          }
      
          // Create a new business owner document
          const newBusinessOwnerData: IBusinessOwnerDocument = new businessOwnerModel({
            _id: new mongoose.Types.ObjectId(),
            personalDetails: {
              email: businessOwnerData.email,
              password: businessOwnerData.password,
              phone: businessOwnerData.phone,
            },
            companyDetails: {
              companyName: businessOwnerData.companyName,
            },
            
            isVerified: false,
            isBlocked: false,
            role: businessOwnerData.role ?? "BusinessOwner", // Default to "owner"
          });
      
          // Save the new business owner
          const businessOwner = await this.businessOwnerRepository.create(newBusinessOwnerData);
      
          // Create a new database for the business owner
          const businessOwnerName = `${businessOwner._id}`;
          const businessOwnerDB = mongoose.connection.useDb(businessOwnerName);
      
          (await businessOwnerDB.createCollection("businessOwners")).insertOne(businessOwner)
      
          // Generate OTP and send it
          const otp = generateOtp();
          await this.sendOtp(businessOwner.personalDetails.email, otp);
      
          return { email: businessOwner.personalDetails.email, success: true };
        } catch (error) {
          console.error("Error registering business owner:", error);
          return {
            message: error instanceof Error ? error.message : "Unknown error occurred",
          };
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
                console.log("verification================", verification);
                
            if (!verification.success) {
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
                await this.sendOtp(existingBusinessOwner.personalDetails.email, otp); 
                return { success: true, message: 'OTP sent successfully.', email: existingBusinessOwner.personalDetails.email }; 
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

    async updateBusinessOwner( businessOwnerData: any): Promise<any> {
      
        try {
          const businessOwnerId = businessOwnerData._id;
            const updatedBusinessOwner = await this.businessOwnerRepository.updateBusinessOwner(businessOwnerId, businessOwnerData);
            return updatedBusinessOwner;
        } catch (error) {
            console.error("Error updating business owner:", error);
            throw new Error("Failed to update business owner. Please try again later.");
        }
    }

    async googleLogin(email: string, password: string, phone: string, companyName: string): Promise<IGoogleResponseDTO> {
      try {
        // Check if the user already exists
        const businessOwnerData = await this.businessOwnerRepository.findByEmail(email);
    
        if (businessOwnerData) {
          // If the user exists, generate access and refresh tokens
          const accessToken = generateAccessToken({businessOwnerData}); // Custom token generation function
          const refreshToken = generateRefreshToken({businessOwnerData});
    
          return {
            success: true, 
            message: "Login successful", 
            accessToken, 
            refreshToken, 
            isVerified: true,
            businessOwnerData, 
            email: businessOwnerData.personalDetails.email ,
            companyName:businessOwnerData.companyDetails.companyName,
            profilePicture:businessOwnerData.personalDetails.profilePicture,
            companyLogo:businessOwnerData.companyDetails.companyLogo,
          };
        } else {
          // If the user doesn't exist, handle as a new registration
          if (!email || !companyName) {
            throw new Error("Email and company name are required for registration.");
          }
    
          const newBusinessOwnerData: IBusinessOwnerDocument = new businessOwnerModel({
            _id: new mongoose.Types.ObjectId(),
            personalDetails: {
              email,
              password: password ? await bcrypt.hash(password, 10) : undefined},
            companyDetails: {
              companyName,
            },
            isVerified: true,
            isBlocked: false,
            role: "BusinessOwner", 
          });
    
          const businessOwner = await this.businessOwnerRepository.create(newBusinessOwnerData);
          const businessOwnerName = `${businessOwner._id}`;
          const businessOwnerDB = mongoose.connection.useDb(businessOwnerName);
          (await businessOwnerDB.createCollection("businessOwners")).insertOne(businessOwner)
    
    
          return {
            success: true,
            message: "New business owner registered. OTP sent for verification.",
            email,
          };
        }
      } catch (error) {
        console.error("Error during Google login:", error);
        return {
          success: false,
          message: error instanceof Error ? error.message : "Failed to login or register. Please try again later.",
        };
      }
    }
    

  
}





