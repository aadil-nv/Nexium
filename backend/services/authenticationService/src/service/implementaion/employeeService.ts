import {generateAccessToken,generateRefreshToken,} from "../../utils/businessOwnerJWT";
import { inject, injectable } from "inversify";
import  IEmployeeRepository  from "../../repository/interfaces/IEmployeeRepository";
import  IEmployeeService from "../interfaces/IEmployeeService";
import { IEmoloyeeLoginDTO } from "../../dto/employeeDTO";
import nodemailer from "nodemailer";
import OtpModel from "../../model/otpModel";
import generateOtp from "../../utils/otp";
import { IValidateOtpDTO } from "../../dto/employeeDTO";
import { log } from "console";
import IBusinessOwnerRepository from "repository/interfaces/IBusinessOwnerRepository";
import RabbitMQMessager from "../../events/rabbitmq/producers/producer";


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
    private _businessOwnerRepository: IBusinessOwnerRepository
    constructor(
      @inject("IEmployeeRepository") employeeRepository: IEmployeeRepository,
      @inject("IBusinessOwnerRepository") businessOwnerRepository: IBusinessOwnerRepository) {
        this._employeeRepository = employeeRepository;
        this._businessOwnerRepository = businessOwnerRepository
    }

    async employeeLogin(email: string, password: string): Promise<any> {
      try {
          const employeeData = await this._employeeRepository.findByCredentialEmail(email, password);
           const rabbitMQMessager = new RabbitMQMessager();
          await rabbitMQMessager.init();
    
          if (!employeeData) {
              return { message: "Invalid email or password. Please try again." };
          }
  
          if (!employeeData.isVerified) {
              const otp = generateOtp();
              await this.sendOtp(employeeData.personalDetails.email, otp);
  
              return { 
                  success: false, 
                  message: "Account not verified. OTP has been sent to your registered email.",
                  email: employeeData.personalDetails.email 
              };
          }
  
          const isPasswordValid = password === employeeData.employeeCredentials.companyPassword; 
  
          if (!isPasswordValid) {
              return { success: false, message: "Invalid email or password. Please try again." };
          }
  
          const businessOwnerData = await this._businessOwnerRepository.findBusinessOwnerById(employeeData.businessOwnerId);
          const accessToken = generateAccessToken({ employeeData });
          const refreshToken = generateRefreshToken({ employeeData });
  
          const employeeIsActiveData =await this._employeeRepository.updateIsActive(employeeData._id, true);
          await rabbitMQMessager.sendToMultipleQueues({ employeeIsActiveData});

         
          return { 
              success: true, 
              message: "Login successful.", 
              data: { ...employeeData.toJSON() },
              accessToken,
              refreshToken,
              workTime: employeeData.professionalDetails.workTime,
              position: employeeData.professionalDetails.position,
              employeeName: employeeData.personalDetails.employeeName,
              eployeeProfilePicture:employeeData.personalDetails.profilePicture ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employeeData.personalDetails.profilePicture}`:employeeData.personalDetails.profilePicture ,
              companyLogo:businessOwnerData?.companyDetails.companyLogo? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${businessOwnerData?.companyDetails.companyLogo}`:businessOwnerData?.companyDetails.companyLogo,
              employeePosition: employeeData.professionalDetails.position,
              companyName: employeeData.professionalDetails.companyName
          };
  
      } catch (error) {
          console.error("Error in employee login service:", error);
          throw new Error("An error occurred while processing your request. Please try again.");
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
            // Check if OTP exists for the email
            const otpData = await this._employeeRepository.findOtpByEmail(email);
            if (!otpData) {
                return { success: false, message: "No OTP record found for the provided email." };
            }
    
            // Verify OTP match
            if (otpData.otp !== otp) {
                return { success: false, message: "Invalid OTP provided. Please try again." };
            }
    
            // Update verification status
            const verification = await this._employeeRepository.updateVerificationStatus(email);
            if (!verification) {
                return { success: false, message: "Failed to update verification status. Please try again." };
            }
    
            // Retrieve employee data
            const employeeData = await this._employeeRepository.findByEmail(email);
            if (!employeeData) {
                return { success: false, message: "Employee not found after verification. Please contact support." };
            }
    
            // Generate tokens
            const accessToken = generateAccessToken({employeeData });
            const refreshToken = generateRefreshToken({ employeeData });

            console.log("accessToken",accessToken);
            console.log("refreshToken",refreshToken);
            
    
            // Return success response
            return {
                success: true,
                email,
                message: "OTP validated and account verified successfully.",
                accessToken,
                refreshToken,
                workTime: employeeData.professionalDetails.workTime,
                position: employeeData.professionalDetails.position
            };
        } catch (error: any) {
            console.error("Error validating OTP:", error.message);
            return { success: false, message: "An error occurred while validating OTP. Please try again." };
        }
    }
     
    async resendOtp(email: string): Promise<{ success: boolean; message: string }> {
      const otp = generateOtp();
      const existingOtp = await this._employeeRepository.findOtpByEmail(email);
      
      if (existingOtp) {
          await this._employeeRepository.updateOtp(email, otp);
          return { success: true, message: 'OTP updated successfully.' }; 
      } else {
          console.log("No existing OTP, creating a new one");
      }
      await this.sendOtp(email, otp);
      return { success: true, message: 'OTP has been sent successfully.' };
  }

  async updateEmployee(employee: any): Promise<any> {
    console.log("employee data---------------to rabbbbbbbb", employee);
    
    try {
        const employeeId = employee._id;
        console.log("employeeId", employeeId);
        
      return this._employeeRepository.update(employeeId, employee);
    } catch (error) {
      console.error('Error in updateEmployee service:', error);
      throw error;
    }
  }

  

}
