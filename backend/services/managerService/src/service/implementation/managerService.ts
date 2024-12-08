import { generateAccessToken, verifyRefreshToken } from "../../utils/jwt";
import IManagerRepository from "../../repository/interface/IManagerRepository";
import IManagerService from "../interface/IManagerService";
import { inject, injectable } from "inversify";

import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { uploadTosS3 } from "../../middlewares/multer-s3";
import IManagerProfileDTO from "../../dto/IManagerDTO";
import IEmployee from "../../entities/employeeEntities";

@injectable()
export default class ManagerService implements IManagerService {
  constructor(
    @inject("IManagerRepository") private _managerRepository: IManagerRepository
  ) {}



  async getManagers(): Promise<any> {
    try {
     const managers = await this._managerRepository.findAll();
     console.log("managers", managers);
     
     if (!managers) {
       throw new Error("No managers found");
     }
     return managers;
    } catch (error) {
      console.error("Error fetching managers:", error);
      throw new Error("Error fetching managers");
    }
  }

  async getManagerPersonalInfo(managerId: string): Promise<IManagerProfileDTO> {

    try {
   
      if (!managerId) {
        throw new Error("Manager ID not found");
       
      }
    
      const managerProfile = await this._managerRepository.findOne({managerId});
      const profileImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${ managerProfile?.personalDetails?.profilePicture}`
          console.log(`profileImageUrl: ${profileImageUrl}`);
          
      return {

        managerName: managerProfile?.personalDetails?.managerName,
        email: managerProfile?.personalDetails.email,
        personalWebsite: managerProfile?.personalDetails?.personalWebsite,
        profilePicture: profileImageUrl
      }

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
  

  async setNewAccessToken(refreshToken: string): Promise<string> {
    console.log("refresh token in manager service", refreshToken);
    
    try {
      const decoded = verifyRefreshToken(refreshToken);
      console.log("decoded==================>", decoded);
      
      const managerData = decoded?.managerData;

      if (!decoded || !managerData) {
        throw new Error("Invalid or expired refresh token");
      }

      return generateAccessToken({ managerData });
    } catch (error) {
      throw new Error("Error generating new access token: " + error);
    }
  }

  private async getDetails(managerId: string) {
    if (!managerId) throw new Error("Business owner ID not found");
    const result = await this._managerRepository.getDetails(managerId);
    if (!result) throw new Error("Business owner not found");
    return result;
  }

  private async uploadFileToS3(managerId: string, file: Express.Multer.File, fileType: "profileImage" | "companyLogo") {
    const result = await this.getDetails(managerId);
    const existingFile = fileType === "profileImage" ? result.personalDetails.profileImage : result.companyDetails.companyLogo;

    if (existingFile) {
      const s3Client = new S3Client({ region: 'eu-north-1' });
      await s3Client.send(new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: existingFile }));
    }

    const fileUrl = await uploadTosS3(file.buffer, file.mimetype);
    console.log("==============fileUrl======================", fileUrl);
    
    return fileUrl
  }

  async updateManagerProfilePicture(managerId: string, file: Express.Multer.File): Promise<any> {
    try {
      const imageUrl = await this.uploadFileToS3(managerId, file, "profileImage");

      console.log("==============imageUrl======================", imageUrl);
      
      await this._managerRepository.uploadProfilePicture(managerId, imageUrl);
      return { success: true, message: 'Image uploaded successfully!', data: { imageUrl:`https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${imageUrl}` } };
    } catch (error:any) {
      throw new Error(error.message || 'Error while uploading image');
    }
  }
  
  async getLeaveEmployees(managerId: string): Promise<IEmployee> {
    try {
      if (!managerId) {
        throw new Error("Business owner ID not found");
      }
  
      const result = await this._managerRepository.getLeaveEmployees(managerId);
      return result;
    } catch (error :any) {
      console.error("Error in getLeaveEmployees:", error.message);
      throw new Error("Error retrieving leave employees");
    }
  }

  async updateManagerAddress(managerId: string, data: any): Promise<any> {
    try {
      if (!managerId) {
        throw new Error("Business owner ID not found");
      }
  
      const result = await this._managerRepository.updateManagerAddress(managerId, data);
        console.log("result", result);
        
      return result;
    } catch (error :any) {
      console.error("Error in updateManagerAddress:", error.message);
      throw new Error("Error updating manager address");
    }
  }
}
