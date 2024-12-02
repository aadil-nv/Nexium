// ManagerRepository.ts
import IManagerRepository from "../interface/IManagerReopsitory";
import managerModel from "../../models/managerModel";
import mongoose from "mongoose";
import { inject, injectable } from "inversify";
import BaseRepository from "./baseRepository";
import {IManager} from "../../entities/managerEntity";
import BusinessOwnerModel from "../../models/businessOwnerModel";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntity";

@injectable()
export default class ManagerRepository extends BaseRepository<IManager> implements IManagerRepository {

  constructor(
    @inject("managerModel") private _managerModel: mongoose.Model<IManager>
  ) {
    super(_managerModel);  
  }

  async getAllManagers(businessOwnerId: string): Promise<IManager[]> {
    try {
      const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
      const manager = _switchDb.model<IManager>('Managers', managerModel.schema);
      return await manager.find(); 
    } catch (error) {
      console.error("Error fetching managers:", error);   
      throw error;
    }
  }


  async addManagers(businessOwnerId: string, managerData: IManager): Promise<IManager> {
    try {
      const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
      const manager = _switchDb.model<IManager>('Managers', managerModel.schema);
      const newManager = new manager(managerData);
      return await newManager.save();
    } catch (error) {
      console.error("Error adding manager:", error);
      throw error;
    }
  }


  async findById(id: string): Promise<IBusinessOwnerDocument> {
    try {
      const businessOwnerData = await BusinessOwnerModel.findById(id).exec();
      if (!businessOwnerData) {
        throw new Error(`BusinessOwner with ID ${id} not found`);
      }
      return businessOwnerData;
    } catch (error) {
      console.error("Error finding business owner by ID:", error);
      throw error;
    }
  }


  async findByEmail(businessOwnerId: string, emailId: string): Promise<IManager | null> {
    try {
      if (!emailId || typeof emailId !== 'string') {
        throw new Error("Invalid emailId format");
      }
      const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
      const manager = _switchDb.model<IManager>('Managers', managerModel.schema);
      return manager.findOne({ email: emailId }).exec();
    } catch (error:any) {
      console.error("Error finding manager by email:", error.message);
      throw new Error("Error finding manager by email: " + error.message);
    }
  }

  async blockManager(businessOwnerId: string, managerData: any): Promise<any> {
    try {
      // Log input for debugging
      console.log("BusinessOwnerId:", businessOwnerId);
      console.log("ManagerData:", managerData);
  
      // Switch to the specific database for the business owner
      const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
      const manager = _switchDb.model<IManager>('Managers', managerModel.schema);
  
      // Log to verify database and model setup
      console.log("Using DB:", businessOwnerId);
  
      // Find the manager by email
      const existingManager = await manager.findOne({ email: managerData.email });
  
      if (!existingManager) {
        console.error("Manager not found:", managerData.email);
        throw new Error("Manager not found.");
      }
  
      // Log current status before toggling
      console.log("Current isBlocked status:", existingManager.isBlocked);
  
      // Toggle the isBlocked status
      const newIsBlocked = !existingManager.isBlocked;
  
      // Log new status
      console.log("New isBlocked status:", newIsBlocked);
  
      // Update the isBlocked status in the database
      const updateResult = await manager.updateOne(
        { email: managerData.email },
        { $set: { isBlocked: newIsBlocked } }
      );
  
      // Log update result
      console.log("Update result:", updateResult);
  
      return updateResult;
    } catch (error) {
      // Log error for detailed debugging
      console.error("Error toggling manager block status:", error);
      throw error;
    }
  }
  
  
}
