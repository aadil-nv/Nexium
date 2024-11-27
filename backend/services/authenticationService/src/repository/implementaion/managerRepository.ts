import { injectable, inject } from "inversify";
import managerModel from "../../model/managerModel";
import IManagerRepository from "../interfaces/IManagerRepository";
import {IManager} from "../../entities/managerEntities";    
import BaseRepository from "./baseRepository";
import OtpModel, { IOtpDocument } from "../../model/otpModel";
import { IUpdateOtpResult } from "../interfaces/IManagerRepository";

@injectable()
export default class ManagerRepository extends BaseRepository<IManager> implements IManagerRepository {
    constructor(
        @inject("managerModel") private _managerModel: any 
    ) {
        super(_managerModel); 
    }

    async findByCredentialEmail(email: string): Promise<IManager | null> {
       
        
        try {

            const manager = await this._managerModel.findOne({ 'managerCredentials.companyEmail': email });
            console.log("manager---from repo", manager);
            
            return manager;
        } catch (error) {
            console.error("Error logging in manager repo:", error);
            throw new Error("Manager login failed");
        }
    }
    async findByEmail(email: string): Promise<IManager | null> {
       
        
        try {

            const manager = await this._managerModel.findOne({ "personalDetails.email": email });
            console.log("manager---from repo", manager);
            
            return manager;
        } catch (error) {
            console.error("Error logging in manager repo:", error);
            throw new Error("Manager login failed");
        }
    }

    async findOtpByEmail(email: string): Promise<any | null> {
        try {
            return await OtpModel.findOne({ email }).exec();
        } catch (error) {
            console.error("Error fetching OTP:", error);
            throw new Error("Failed to fetch OTP");
        }
    }

    async updateVerificationStatus(email: string): Promise<any> {
        try {
            return await this._managerModel.updateOne({"personalDetails.email": email }, { isVerified: true }).exec();
        } catch (error) {
            console.error("Error updating verification status:", error);
            throw new Error("Failed to update verification status");
        }
    }


    async updateOtp(email: string, otp: string): Promise<IUpdateOtpResult> {
        try {
          const result = await OtpModel.updateOne(
            { email },
            { otp, createdAt: new Date(), updatedAt: new Date() }
          );
      
          if (result.modifiedCount === 0) {
            throw new Error('No document found or OTP was not changed.');
          }
      
          return {
            success: true,
            message: 'OTP updated successfully.',
          };
        } catch (error) {
          console.error('Error updating OTP:', error);
      
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update OTP.',
          };
        }
      }
      
      
}
