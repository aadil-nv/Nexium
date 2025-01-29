import { injectable, inject } from "inversify";
import IManagerService from "../interfaces/IManagerService";
import { ITokenResponse } from "../interfaces/IBusinessOwnerService";
import IManagerRepository from "../../repository/interfaces/IManagerRepository";
import { generateAccessToken, generateRefreshToken } from "../../utils/businessOwnerJWT";
import generateOtp from "../../utils/otp";
import nodemailer from "nodemailer";
import OtpModel from "../../model/otpModel";
import { ILoginDTO, IResponseDTO, IValidateOtpDTO } from "../../dto/managerDTO";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

@injectable()
export default class ManagerService implements IManagerService {
  private _managerRepository: IManagerRepository;

  constructor(@inject("IManagerRepository") managerRepository: IManagerRepository) {
    this._managerRepository = managerRepository;
  }

  async managerLogin(email: string, password: string): Promise<ILoginDTO> {
    console.log("email",email ,"passwor",password);
    
    try {
      if (!email || !password) throw new Error('Email and password are required');

      // const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      // const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

      // if (!emailRegex.test(email)) throw new Error('Invalid email format');
      // if (!passwordRegex.test(password)) throw new Error('Password must be at least 6 characters, 1 uppercase, 1 digit, 1 symbol');

      const managerData = await this._managerRepository.findByCredentialEmail(email);
    
      console.log("managerData",managerData);
      
      if (!managerData || managerData.managerCredentials.companyPassword !== password) throw new Error('Invalid email or password');
   

      

      if(managerData.isBlocked) {

      
        return {  message: "Account is blocked. Please contact admin", isVerified:false, email: managerData.personalDetails.email };
      }

      if (!managerData.isVerified) {
    
        const otp = generateOtp();
        await this.sendOtp(managerData.personalDetails.email, otp);

        return {
          success: false,
          message: "Account not verified. Check your email for OTP",
          isVerified: false,
          email: managerData.personalDetails.email,
        };
      }
        
      const accessToken = generateAccessToken({  managerData });
      const refreshToken = generateRefreshToken({ managerData });

      const managerName = managerData.personalDetails.managerName;
      const managerProfilePicture = managerData.personalDetails.profilePicture ?`https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${ managerData.personalDetails.profilePicture }`:managerData.personalDetails.profilePicture
      const companyLogo = managerData.companyDetails.companyLogo ?  `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${managerData.companyDetails.companyLogo}` :managerData.companyDetails.companyLogo;
      const managerType = managerData.professionalDetails.managerType;
      const companyName = managerData.companyDetails.companyName;

      return {accessToken,refreshToken,success: true,managerName,managerProfilePicture,companyLogo,managerType,companyName};
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
      const otpData = await this._managerRepository.findOtpByEmail(email);
      if (!otpData) throw new Error("Manager not found");

      if (otpData.otp === otp) {
        const verification = await this._managerRepository.updateVerificationStatus(email);
        if (!verification) {
          return { success: false, message: "Manager verification failed." };
        }
          console.log("email",email);
          
        const managerData = await this._managerRepository.findByEmail(email);
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

  async addManager(data: any): Promise<any> {
    console.log("data derpppppppppppppppppppppppppppppppp",data);
    
    try {
      return this._managerRepository.create(data);
    } catch (error) {
      console.error(error);
      return Promise.resolve(error);
    }
  }

  async resendOtp(email: string): Promise<IValidateOtpDTO> {
    const otp = generateOtp();
    const existingOtp = await this._managerRepository.findOtpByEmail(email);
    
    if (existingOtp) {
        await this._managerRepository.updateOtp(email, otp);
        return { success: true, message: 'OTP updated successfully.' }; 
    } else {
        console.log("No existing OTP, creating a new one");
    }
    await this.sendOtp(email, otp);
    return { success: true, message: 'OTP has been sent successfully.' };
  }

    async blockManager(managerData: any): Promise<IResponseDTO> {
  try {
 
    
    if ( !managerData) {
      throw new Error("Invalid input: Business Owner ID or Manager Data is missing.");
    }

    const response = await this._managerRepository.blockManager( managerData);
    
    if (!response) {
      throw new Error("Failed to update manager status. Please try again.");
    }

    console.log("Manager block status toggled:", response);
    console.log("1111111111111111111111111111111111");
    
  
    console.log("222222222222222222222222222222222222");

    return {
      success: true,
      message: "Manager block status toggled successfully!",
    };
  } catch (error: any) {
    console.error("Error toggling manager block status:", error);

    // Add specific error names for handling in the controller
    if (error.message.includes("Invalid input")) {
      error.name = "ValidationError";
    } else if (error.message.includes("Failed to update")) {
      error.name = "DatabaseError";
    } else {
      error.name = "InternalServerError";
    }

    throw error;
  }
    }

    async updateManger(managerData: any): Promise<any> {
      console.log("employee data---------------to rabbbbbbbb", managerData);
      
      try {
          const maangerId = managerData._id;
          console.log("employeeId", maangerId);
          
        return this._managerRepository.update(maangerId, managerData);
      } catch (error) {
        console.error('Error in updateEmployee service:', error);
        throw error;
      }
    }



}
