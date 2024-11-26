import {generateAccessToken,generateRefreshToken,} from "../../utils/businessOwnerJWT";
import { inject, injectable } from "inversify";
import  IEmployeeRepository  from "../../repository/interfaces/IEmployeeRepository";
import  IEmployeeService from "../interfaces/IEmployeeService";
import { IEmoloyeeLoginDTO } from "../../dto/employeeDTO";
import nodemailer from "nodemailer";
import OtpModel from "../../model/otpModel";
import generateOtp from "../../utils/otp";
import { IValidateOtpDTO } from "dto/ILoginDTO";


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
@injectable()
export default class EmployeeService implements IEmployeeService {
    private _employeeRepository: IEmployeeRepository;
    constructor(@inject("IEmployeeRepository") employeeRepository: IEmployeeRepository) {
        this._employeeRepository = employeeRepository;
    }

    async employeeLogin(email: string, password: string): Promise<any> {
        try {
          // Find employee by email and password
          const employeeData = await this._employeeRepository.findByCredentialEmail(email,password);
             console.log("employeeData===================",employeeData);
             
          // Check if employee is found
          if (!employeeData) {
            throw new Error("Invalid email or password");
          }
    
          // Check if employee is verified
          if (!employeeData.isVerified) {
            const otp = generateOtp();
            await this.sendOtp(employeeData.personalDetails.email, otp);
            throw new Error("Account not verified. OTP has been sent to your email.");
            return { success :false , message:"Account not verified",email: employeeData.personalDetails.email }
          }
    
          // Compare the password with the stored hashed password using bcrypt
          const isPasswordValid = password == employeeData.employeeCredentials.companyPassword
          
          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }
    
          // Generate access and refresh tokens
          const accessToken = generateAccessToken({ employeeData });
          const refreshToken = generateRefreshToken({ employeeData });
    
          // Return employee data with tokens
          return { ...employeeData.toJSON(), accessToken, refreshToken };
        } catch (error) {
          console.error("Error in employee login service", error);
          throw error;
        }
      }

   async  addEmployee(employeeData: any):Promise<any>{
    console.log("employee data",employeeData);
    
        try {
            return this._employeeRepository.create(employeeData);
            
            
        } catch (error) {
            console.error('Error in managerLogin service:', error);
            throw error;
            
        }
    }


    async sendOtp(email: string, otp: string): Promise<void> {
        const otpRecord = new OtpModel({
        
          email,
          otp,
          createdAt: new Date(),
        });
    
        await otpRecord.save();
    
        const expirationTime = "10 minutes";
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Your OTP for Verification",
          text: `Your OTP for verification is ${otp}. It is valid for ${expirationTime}.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
              <h2>Your OTP for Verification</h2>
              <p>Your OTP for verification is <strong style="font-size: 24px; color: #4CAF50;">${otp}</strong>.</p>
              <p>This OTP is valid for <strong style="color: #FF5722;">${expirationTime}</strong> from the time of request.</p>
              <p>Date: <strong>${new Date().toLocaleString()}</strong></p>
              <footer>&copy; ${new Date().getFullYear()} Nexium All rights reserved.</footer>
            </div>
          `,
        };
    
        try {
          await transporter.sendMail(mailOptions);
        } catch (error) {
          console.error("Error sending OTP email:", error);
          throw new Error("Failed to send OTP. Please try again later.");
        }
      }

      async validateOtp(email: string, otp: string): Promise<IValidateOtpDTO> {
        try {
          const otpData = await this._employeeRepository.findOtpByEmail(email);
          if (!otpData) throw new Error("Manager not found");
    
          if (otpData.otp === otp) {
            const verification = await this._employeeRepository.updateVerificationStatus(email);
            if (!verification) {
              return { success: false, message: "Manager verification failed." };
            }
              console.log("email",email);
              
            const managerData = await this._employeeRepository.findByEmail(email);
            console.log("managerData",managerData);
            
            const accessToken = generateAccessToken({ managerData });
            const refreshToken = generateRefreshToken({ managerData });
    
            console.log("managerData",managerData);
            console.log("accessToken",accessToken);
            console.log("refreshToken",refreshToken);
            
            
    
            return {
              success: true,
              email,
              message: "OTP validated and company verified successfully",
              accessToken,
              refreshToken,
            };
          } else {
            throw new Error("Invalid OTP provided.");
          }
        } catch (error) {
          console.error("Error validating OTP:", error);
          return { message: error instanceof Error ? error.message : "Unknown error occurred" };
        }
      }  
}
