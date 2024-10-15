import { ICompany, ICompanyDocument, ITokenResponse } from '../../entities/ICompany';
import CompanyRepository from '../../Repositery/implementaion/companyRepositery';
import bcrypt from 'bcryptjs';
import { generateCompanyAccessToken, generateCompanyRefreshToken } from '../../Utils/companyJwt';
import mongoose from 'mongoose';
import CompanyModel from '../../Schemas/companyRecordsSchema';
import generateOtp from '../../Utils/otp';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import otpModel from "../../Schemas/otpScheema"
dotenv.config();




const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export class CompanyService {
    private companyRepository: CompanyRepository;

    constructor() {
        this.companyRepository = new CompanyRepository();
    }

    async login(email: string, password: string): Promise<ITokenResponse> {
    
        const company = await this.companyRepository.findByEmail(email);
        if (!company) {
            throw new Error('Company not found');
        }

     
        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        return this.generateTokens(company);
    }


     
    async register(
        companyData: Partial<ICompany>
      ): Promise<{ tokens?: ITokenResponse; message?: string; email?: string }> {
        console.log('CompanyService is hitting ---'.bgCyan);
      
        // Hash the password if it exists
        if (companyData.password) {
          companyData.password = await bcrypt.hash(companyData.password, 10);
        }
      
        // Ensure registration number is provided
        if (!companyData.registrationNumber) {
          throw new Error('Registration number is required');
        }
      
        // Check if the company already exists
        const existingCompany = await CompanyModel.findOne({
          $or: [
            { email: companyData.email },
            { phone: companyData.phone },
            { registrationNumber: companyData.registrationNumber },
          ],
        });
      
        if (existingCompany) {
          if (existingCompany.isVerified) {
            throw new Error('Credentials already used. Please check the details.');
          }
      
          // Send OTP to existing company if not verified
          await this.sendOtp(existingCompany.email);
          console.log('COMPANYDATA EMAIL', existingCompany.email);
      
          // Return the existing company's email if it's not verified
          return { message: 'true', email: existingCompany.email };
        }
      
        // Create a new database for the company
        const companyDbName = `company_${companyData.registrationNumber}`;
        const companyDb = mongoose.connection.useDb(companyDbName);
      
        // Create a new 'users' collection in the company's database
        await companyDb.createCollection('users');
      
        // Prepare the new company data
        const newCompanyData: ICompanyDocument = new CompanyModel({
          _id: new mongoose.Types.ObjectId(),
          name: companyData.name || '',
          email: companyData.email || '',
          address: companyData.address || '',
          password: companyData.password || '',
          phone: companyData.phone || '',
          website: companyData.website,
          registrationNumber: companyData.registrationNumber,
          documents: companyData.documents || [],
          subscription: companyData.subscription || {
            planName: 'Trial',
            planType: 'Trial',
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            status: 'Active',
          },
          isVerified: false,
        });
      
        // Save the new company to the database
        const savedCompany = await this.companyRepository.create(newCompanyData);
      
        // Send OTP to the newly registered company
        await this.sendOtp(savedCompany.email);
      
        // Generate tokens for the new company
        const tokens = this.generateTokens(savedCompany);
        console.log('++++EMAIL IS ++++', savedCompany.email);
      
        // Return the tokens and the email of the saved company
        return {
          tokens,
          message: 'true',
          email: savedCompany.email,
        };
      }
      
    
    
    
    async sendOtp(email: string): Promise<void> {
        console.log("Hitting sendOtp ---".bgRed);
        console.log(`Sending OTP to ${email}`);
        console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Pass:', process.env.EMAIL_PASS);
    
        const otp = generateOtp();
        console.log("OTP:", otp);
         
        const otpRecord = new otpModel({
            email: email,
            otp: otp,
            createdAt: new Date() 
        });
    
        await otpRecord.save();
    
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Verification',
            text: `Your OTP for verification is ${otp}. It is valid for 10 minutes.`,
            html: `<p>Your OTP for verification is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
        };
    
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('OTP email sent: %s', info.messageId);
            
        } catch (error) {
            console.error('Error sending OTP email:', error);
            throw new Error('Failed to send OTP. Please try again later.');
        }
    }

    generateTokens(company: ICompanyDocument): ITokenResponse {
        const accessToken = generateCompanyAccessToken(company);
        const refreshToken = generateCompanyRefreshToken(company);
        return { accessToken, refreshToken };
    }

    async validateOtp(email: string, otp: string): Promise<boolean> {
        console.log("Hitting validateOtp --- companyService".bgYellow);
        console.log("Email:", email);
        console.log("OTP:", otp);
    
        try {
            // Retrieve the recorded company based on email
            const recordedCompany = await this.companyRepository.findOtpByEmail(email);
    
            // Check if the company exists
            if (!recordedCompany) {
                console.error("Company not found for email:", email);
                throw new Error("Company not found");
            }
    
            // Check if the recorded OTP matches the provided OTP
            if (recordedCompany.otp === otp) { 
                console.log("OTP validated successfully:", recordedCompany.otp);
                const verfication = await this.companyRepository.updateVerificationStatus(email);

                if(!verfication) {
                    return false
                }
                    return true;
                    
                 
            } else {
                console.log("Invalid OTP provided.");
                return false;  
            }
        } catch (error) {
            console.error("Error validating OTP:", error);
            return false;  
        }
    }
    
}
