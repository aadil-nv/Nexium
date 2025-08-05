import { injectable, inject } from "inversify";
import IManagerService from "../interfaces/IManagerService";
import IManagerRepository from "../../repository/interfaces/IManagerRepository";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import generateOtp from "../../utils/otp";
import nodemailer from "nodemailer";
import OtpModel from "../../model/otpModel";
import { ILoginDTO, IResponseDTO, IValidateOtpDTO } from "../../dto/managerDTO";
import IBusinessOwnerRepository from "../../repository/interfaces/IBusinessOwnerRepository";
import mongoose, { ObjectId } from "mongoose";

const transporter = nodemailer.createTransport({ service: "Gmail", auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS, }, });

@injectable()
export default class ManagerService implements IManagerService {
  private _managerRepository: IManagerRepository;
  private _businessOwnerRepository: IBusinessOwnerRepository;

  constructor(@inject("IManagerRepository") managerRepository: IManagerRepository,
    @inject("IBusinessOwnerRepository") businessOwnerRepository: IBusinessOwnerRepository) {
    this._managerRepository = managerRepository;
    this._businessOwnerRepository = businessOwnerRepository;
  }

  async managerLogin(email: string, password: string): Promise<ILoginDTO> {

    try {
      if (!email || !password) throw new Error('Email and password are required');

      const managerData = await this._managerRepository.findByCredentialEmail(email);

      if (!managerData) {
        return { message: "Invalid email or password", success: false };
      }
      const businessOwnerData = await this._businessOwnerRepository.findBusinessOwnerById(managerData?.businessOwnerId);
      if (!businessOwnerData) {
        return { message: "Business owner not found", success: false };
      }



      if (businessOwnerData?.isBlocked) {
        return { message: "company is blocked. Please contact admin", isVerified: false, email: managerData.personalDetails.email };
      }

      if (managerData.isBlocked) {
        return { message: "Account is blocked. Please contact admin", isVerified: false, email: managerData.personalDetails.email };
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

      if (managerData.isActive == false) {
        await this._managerRepository.updateIsActive(managerData.businessOwnerId as ObjectId, managerData._id, true);
      }
      const accessToken = generateAccessToken({ managerData });
      const refreshToken = generateRefreshToken({ managerData });


      const managerName = managerData.personalDetails.managerName;
      const managerProfilePicture = managerData.personalDetails.profilePicture ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${managerData.personalDetails.profilePicture}` : managerData.personalDetails.profilePicture
      const companyLogo = managerData.companyDetails.companyLogo ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${managerData.companyDetails.companyLogo}` : managerData.companyDetails.companyLogo;
      const managerType = managerData.professionalDetails.managerType;
      const companyName = managerData.companyDetails.companyName;

      return { accessToken, refreshToken, success: true, managerName, managerProfilePicture, companyLogo, managerType, companyName };
    } catch (error) {
      console.error('Error in managerLogin service:', error);
      throw error;
    }
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    const otpRecord = new OtpModel({ email, otp, createdAt: new Date(), });

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

      const managerData = await this._managerRepository.findByEmail(email);
      if (!managerData) {
        return { success: false, message: "Manager not found" };
      }

      if (!managerData.businessOwnerId) {
        return { success: false, message: "Business owner ID is missing." };
      }



      if (otpData.otp === otp) {
        const verification = await this._managerRepository.updateVerificationStatus(email, managerData.businessOwnerId as ObjectId);
        if (!verification) {
          return { success: false, message: "Manager verification failed." };
        }

        console.log("email", email);
        if (managerData.isActive == false) {
          await this._managerRepository.updateIsActive(managerData.businessOwnerId as ObjectId, managerData._id, true);
        }


        const accessToken = generateAccessToken({ managerData });
        const refreshToken = generateRefreshToken({ managerData });

        const managerName = managerData.personalDetails.managerName;
        const managerProfilePicture = managerData.personalDetails.profilePicture
          ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${managerData.personalDetails.profilePicture}`
          : managerData.personalDetails.profilePicture;

        const companyLogo = managerData.companyDetails.companyLogo
          ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${managerData.companyDetails.companyLogo}`
          : managerData.companyDetails.companyLogo;

        const managerType = managerData.professionalDetails.managerType;
        const companyName = managerData.companyDetails.companyName;

        return {
          success: true,
          email,
          message: "OTP validated and company verified successfully",
          accessToken,
          refreshToken,
          managerName,
          managerProfilePicture,
          companyLogo,
          managerType,
          companyName,
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


      if (!managerData) {
        throw new Error("Invalid input: Business Owner ID or Manager Data is missing.");
      }

      const response = await this._managerRepository.blockManager(managerData);

      if (!response) {
        throw new Error("Failed to update manager status. Please try again.");
      }

      return {
        success: true,
        message: "Manager block status toggled successfully!",
      };
    } catch (error: any) {
      console.error("Error toggling manager block status:", error);

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
    try {
      const maangerId = managerData._id;
      return this._managerRepository.update(maangerId, managerData);
    } catch (error) {
      console.error('Error in updateEmployee service:', error);
      throw error;
    }
  }



}
