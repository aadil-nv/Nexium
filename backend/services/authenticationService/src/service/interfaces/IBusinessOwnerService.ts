
import { IBusinessOwner, ITokenResponse } from "dto/businessOwnerDTO";
import { IGoogleResponseDTO } from "../../dto/managerDTO";



export default interface IBusinessOwnerService {
  login(email: string, password: string): Promise<ITokenResponse>;
  register(businessOwnerData: Partial<IBusinessOwner>): Promise<ITokenResponse>;
  sendOtp(email: string, otp: string): Promise<void>;
  validateOtp(email: string, otp: string): Promise<any>;
  resendOtp(email: string): Promise<{ success: boolean; message: string }>;
  forgotPassword(email: string): Promise<{ success: boolean; message: string; email?: string }>;
  addNewPassword(email: string, password: string): Promise<{ success: boolean; message: string }>;
  updateBusinessOwner( businessOwnerData: any): Promise<any>
  googleLogin(email: string, password: string,phone: string,companyName: string): Promise<IGoogleResponseDTO>
}