import { injectable, inject } from "inversify";
import managerModel from "../../model/managerModel";
import IManagerRepository from "../interfaces/IManagerRepository";
import {IManager} from "../../entities/managerEntities";    
import BaseRepository from "./baseRepository";
import OtpModel, { IOtpDocument } from "../../model/otpModel";
import { IUpdateOtpResult } from "../interfaces/IManagerRepository";
import mongoose, { ObjectId } from "mongoose";

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

    async updateVerificationStatus(email: string ,businessOwnerId : ObjectId): Promise<any> {
        try {
          const _switchDb = mongoose.connection.useDb(businessOwnerId.toString(), { useCache: true });
          const manager = _switchDb.model('Manager', managerModel.schema)
          await manager.updateOne({"personalDetails.email": email }, { isVerified: true }).exec();
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


      async blockManager(managerData: any): Promise<any> {
        try {
          if (!managerData.managerId || managerData.isBlocked === undefined) {
            throw new Error("Invalid input: email or isBlocked status is missing.");
          }    
      

          const existingManager = await this._managerModel.findOne({ _id: managerData.managerId });
     
          if (!existingManager) {
            console.error("Manager not found:", managerData.managerId);
            throw new Error("Manager not found.");
          }
  
          const updateResult = await this._managerModel.updateOne(
            { _id: managerData.managerId },
            { $set: { isBlocked: managerData.isBlocked } }
          );
       
      
          return updateResult;
     
        } catch (error) {
          // Log error for debugging
          console.error("Error updating manager block status:", error);
          throw error;
        }
      }


      async updateManager(managerId: any, managerData: any): Promise<any> {
        try {
            // Ensure `isVerified` is not updated
            const { isVerified, ...updateData } = managerData;
    
            // Update the manager details without modifying the isVerified field
            return this._managerModel.updateOne({ _id: managerId }, { $set: updateData });
        } catch (error) {
            console.error('Error in updateManager service:', error);
            throw error;
        }
    }

    async updateIsActive (businessOwnerId: string ,id: any, isActive: boolean): Promise<IManager | null> {
      try {
        const _switchDb = mongoose.connection.useDb(id.toString(), { useCache: true });
        const switchedDB = _switchDb.model('managers', this._managerModel.schema);
        const manager = await this._managerModel.findOneAndUpdate(
          { _id: id },
          { $set: { isActive } },
          { new: true }
        ).exec();
        await switchedDB.findOneAndUpdate(
          { _id: id },
          { $set: { isActive } },
          { new: true }
        )
        return manager;
      } catch (error) {
        console.error("Error updating manager:", error);
        throw new Error(error instanceof Error ? error.message : "Unknown error occurred.");
      }
    }
    
      
      
}
