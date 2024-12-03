import { inject, injectable } from "inversify";
import IBaseRepository from "../interface/IBaseRepository";
import IManagerRepository from "../interface/IManagerRepository";
import {IManager} from "../../entities/managerEntities";
import BaseRepository from "../../repository/implementation/baseRepository";
import { Model } from "mongoose";
import managerModel from "../../models/managerModel";


@injectable()
export default class ManagerRepository extends BaseRepository<IManager> implements IManagerRepository{
    constructor(@inject("managerModel") managerModel: Model<IManager>) {
        super(managerModel);
    }

    async getManagers(): Promise<IManager[]> {
        try {   
            return await managerModel.find();  
        } catch (error) {
            console.log("Error finding documents:", error);
            return []; 
        }
    }

    async updateManagerPersonalInfo(managerId: string, data: any): Promise<IManager | null> {
        console.log("Updating manager personal info in repository layer:", managerId, data);
      
        try {
          const manager = await managerModel.findById(managerId);
      
          if (!manager) {
            console.error("Manager not found");
            return null;
          }
      
          // Merge new personal details into existing details
          manager.personalDetails = {
            ...manager.personalDetails, // Directly merge the existing details
            ...data, // Assuming `data` contains the updated personal details
          };
      
          await manager.save();
      
          return manager;
        } catch (error) {
          console.error("Error updating manager personal info:", error);
          return null;
        }
      }

      async findIsBlocked(managerId: string): Promise<boolean | null> {

        console.log("Finding manager by ID in repository layer:", managerId);
        
        try {
          const manager = await managerModel.findById(managerId);
          if (!manager) {
            return null; // Return null if no manager is found
          }
          return manager.isBlocked ?? null; // Return isBlocked status or null if not available
        } catch (error) {
          console.error("Error finding manager by ID:", error);
          return null; // Return null in case of any error
        }
      }
      
      
}