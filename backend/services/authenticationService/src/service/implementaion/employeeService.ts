import { generateAccessToken, generateRefreshToken, } from "../../utils/jwt";
import { inject, injectable } from "inversify";
import IEmployeeRepository from "../../repository/interfaces/IEmployeeRepository";
import IEmployeeService from "../interfaces/IEmployeeService";
import nodemailer from "nodemailer";
import OtpModel from "../../model/otpModel";
import generateOtp from "../../utils/otp";
import IBusinessOwnerRepository from "repository/interfaces/IBusinessOwnerRepository";


const transporter = nodemailer.createTransport({ service: "Gmail", auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS, }, });
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
      if (!employeeData) {
        return { message: "Invalid email or password. Please try again.", success: false };
      }

      const businessOwnerData = await this._businessOwnerRepository.findBusinessOwnerById(employeeData.businessOwnerId);
      if (!businessOwnerData) {
        return { message: "Business owner not found. Please contact support.", success: false };
      }

      if (!employeeData.isVerified) {
        const otp = generateOtp();
        await this.sendOtp(employeeData.personalDetails.email, otp);
        return {
          success: true,
          isVerified: false,
          message: "Account not verified. OTP has been sent to your registered email.",
          email: employeeData.personalDetails.email
        };
      }

      const isPasswordValid = password === employeeData.employeeCredentials.companyPassword;
      if (!isPasswordValid) {
        return { success: false, message: "Invalid email or password. Please try again." };
      }

      if (businessOwnerData?.isBlocked) {
        return { message: "Company is blocked. Please contact admin.", isBusinessOwnerBlocked: true };
      }

      if (employeeData.isBlocked) {
        return { message: "Account is blocked. Please contact admin.", isBlocked: true };
      }

      if (employeeData.isActive == false) {
        await this._employeeRepository.updateIsActive(businessOwnerData._id.toString(), employeeData._id, true);
      }
      const accessToken = generateAccessToken({ employeeData });
      const refreshToken = generateRefreshToken({ employeeData });

      return {
        success: true,
        isVerified: true,
        isBlocked: false,
        message: "Login successful.",
        data: { ...employeeData.toJSON() },
        accessToken,
        refreshToken,
        workTime: employeeData.professionalDetails.workTime,
        position: employeeData.professionalDetails.position,
        employeeName: employeeData.personalDetails.employeeName,
        employeeProfilePicture: employeeData.personalDetails.profilePicture
          ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employeeData.personalDetails.profilePicture}`
          : employeeData.personalDetails.profilePicture,
        companyLogo: businessOwnerData?.companyDetails.companyLogo
          ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${businessOwnerData.companyDetails.companyLogo}`
          : businessOwnerData?.companyDetails.companyLogo,
        employeePosition: employeeData.professionalDetails.position,
        companyName: employeeData.professionalDetails.companyName
      };
    } catch (error) {
      console.error("Error in employee login service:", error);
      throw new Error("An error occurred while processing your request. Please try again.");
    }
  }

  async addEmployee(employeeData: any): Promise<any> {

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

  async validateOtp(email: string, otp: string): Promise<any> {
    try {
      const otpData = await this._employeeRepository.findOtpByEmail(email);
      if (!otpData) {
        return { success: false, message: "Invalid OTP provided. Please try again." };
      }
      const employeeData = await this._employeeRepository.findByEmail(email);
      if (!employeeData) {
        return { success: false, message: "Employee not found after verification. Please contact support." };
      }

      if (otpData.otp !== otp) {
        return { success: false, message: "Invalid OTP provided. Please try again." };
      }

      if (employeeData.isVerified == false) {

        const verification = await this._employeeRepository.updateVerificationStatus(email, employeeData.businessOwnerId);
      }

      // Retrieve employee data

      const businessOwnerData = await this._businessOwnerRepository.findBusinessOwnerById(employeeData.businessOwnerId);
      if (!businessOwnerData) {
        return { success: false, message: "Business owner not found after verification. Please contact support." };
      }

      if (employeeData.isActive == false) {
        await this._employeeRepository.updateIsActive(businessOwnerData._id.toString(), employeeData._id, true);
      }

      const accessToken = generateAccessToken({ employeeData });
      const refreshToken = generateRefreshToken({ employeeData });

      return {
        success: true,
        isVerified: true,
        isBlocked: false,
        message: "Login successful.",
        data: { ...employeeData.toJSON() },
        accessToken,
        refreshToken,
        workTime: employeeData.professionalDetails.workTime,
        position: employeeData.professionalDetails.position,
        employeeName: employeeData.personalDetails.employeeName,
        employeeProfilePicture: employeeData.personalDetails.profilePicture
          ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employeeData.personalDetails.profilePicture}`
          : employeeData.personalDetails.profilePicture,
        companyLogo: businessOwnerData?.companyDetails.companyLogo
          ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${businessOwnerData.companyDetails.companyLogo}`
          : businessOwnerData?.companyDetails.companyLogo,
        employeePosition: employeeData.professionalDetails.position,
        companyName: employeeData.professionalDetails.companyName
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
    try {
      const employeeId = employee._id;
      return this._employeeRepository.update(employeeId, employee);
    } catch (error) {
      console.error('Error in updateEmployee service:', error);
      throw error;
    }
  }


}
