import { verifyRefreshToken } from "../../utils/jwt";
import IManagerRepository from "../../repository/interface/IManagerRepository";
import IManagerService from "../interface/IManagerService";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export default class ManagerService implements IManagerService {
  constructor(
    @inject("IManagerRepository") private _managerRepository: IManagerRepository
  ) {}



  async getManagers(): Promise<any> {
    try {
      return await this._managerRepository.findAll();
    } catch (error) {
      console.error("Error fetching managers:", error);
      throw new Error("Error fetching managers");
    }
  }

  async getManagerPersonalInfo(managerId: string): Promise<any> {

    try {
   
      if (!managerId) {
        throw new Error("Manager ID not found");
       
      }
    
      const managerProfile = await this._managerRepository.findOne({managerId});
      return managerProfile;

    } catch (error) {
      console.error("Error adding manager:", error);
      throw new Error("Error adding manager");
    }
  }

  async getManagerProfessionalInfo(managerId: string): Promise<any> {
  
    try {
      if (!managerId) {
        throw new Error("Manager ID not found");
       
      }
  
      const managerProfile = await this._managerRepository.findOne({ managerId });

      if (!managerProfile?.professionalDetails) {
        throw new Error("Professional details not found for this manager");
      }
  
      return managerProfile.professionalDetails;
  
    } catch (error: any) {
      console.error("Error in getManagerProfessionalInfo:", error.message);
      throw new Error("Error retrieving manager professional information");
    }
  }

  async getManagerAddress(managerId: string): Promise<any> {

    try {
      if (!managerId) {
        throw new Error("Manager ID not found");
       
      }
  
      const managerProfile = await this._managerRepository.findOne({ managerId });

      if (!managerProfile?.address) {
        throw new Error("Professional details not found for this manager");
      }

      
  
      return managerProfile.address;
  
    } catch (error: any) {
      console.error("Error in getManagerProfessionalInfo:", error.message);
      throw new Error("Error retrieving manager professional information");
    }
  }

  async getManagerCredentials(managerId: string): Promise<any> {
    try {
      if (!managerId) {
        throw new Error("Manager ID not found");
       
      }
  
      const managerProfile = await this._managerRepository.findOne({ managerId });

  
      // Return only professionalDetails
      if (!managerProfile?.managerCredentials) {
        throw new Error("Professional details not found for this manager");
      }
 
      
  
      return managerProfile.managerCredentials;
  
    } catch (error: any) {
      console.error("Error in getManagerProfessionalInfo:", error.message);
      throw new Error("Error retrieving manager professional information");
    }
  }

  async getManagerDocuments(managerId: string): Promise<any> {
    try {
      if (!managerId) {
        throw new Error("Manager ID not found");
       
      }
  
      const managerProfile = await this._managerRepository.findOne({ managerId });
  
      // Return only professionalDetails
      if (!managerProfile?.documents) {
        throw new Error("Professional details not found for this manager");
      }

      return managerProfile.documents;
  
    } catch (error: any) {
      console.error("Error in getManagerProfessionalInfo:", error.message);
      throw new Error("Error retrieving manager professional information");
    }
  }

  async updateManagerPersonalInfo(managerId: string, personalData: any): Promise<any> {
    console.log("Hitting manager update personal info==========service layer========");
  
    try {
      if (!managerId) {
        throw new Error("Manager ID not provided");
      }
  
      const managerProfile = await this._managerRepository.updateManagerPersonalInfo(managerId, personalData);
  
      if (!managerProfile?.personalDetails) {
        throw new Error("Personal details not found for this manager");
      }
  
      // Return updated personal details
      return managerProfile.personalDetails;
    } catch (error: any) {
      console.error("Error in updateManagerPersonalInfo:", error.message);
      throw new Error("Error updating manager personal information");
    }
  }
  


  
  
}
