import { injectable,inject } from "inversify";
import IEmployeeRepository  from "../../repository/interface/IEmployeeRepository";
import IEmployeeService from "../interface/IEmployeeService";
import { verifyRefreshToken,generateAccessToken } from "../../utils/jwt";
import { IGetProfileDTO, ISetNewAccessTokenDTO,IEmployeeResponseDTO, IGetAddressDTO, IGetEmployeeProfessionalDTO, IGetDocumentDTO, IGetCredentailsDTO } from "../../dto/IEmployeeDTO";
import { uploadTosS3 } from "../../middlewares/multer-s3";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import e from "express";
import RabbitMQMessager from "../../events/implementation/producer";



@injectable()
export default class EmployeeService implements IEmployeeService {
    constructor(@inject("IEmployeeRepository")
     private _employeeRepository: IEmployeeRepository) {}
    
  async  setNewAccessToken(refreshToken:string):Promise<ISetNewAccessTokenDTO> {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      
      const employeeData = decoded?.employeeData;

      if (!decoded || !employeeData) {
        throw new Error("Invalid or expired refresh token");
      }

      const accessToken = generateAccessToken({ employeeData });
      return {
        accessToken,
        message: "Access token set successfully from service ",
        success: true,
        businessOwnerId: employeeData.businessOwnerId
      }


    } catch (error:any) {
      throw new Error("Error generating new access token: " + error.message);
    }
  } 

  async getProfile(employeeId: string): Promise<IGetProfileDTO> {
        
        try {
          const employee = await this._employeeRepository.getProfile( employeeId);

                console.log("data from service", employee);
                

          if (!employee) {
            throw new Error("Employee not found");
          }
          const profilePicture = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employee.personalDetails.profilePicture}`
          return {
   
            employeeName: employee?.personalDetails.employeeName,
            email: employee?.personalDetails.email,
            phone: employee?.personalDetails.phone,
            profilePicture: profilePicture,
            personalWebsite: employee?.personalDetails.personalWebsite,
            bankAccountNumber: employee?.personalDetails.bankAccountNumber,
            ifscCode: employee?.personalDetails.ifscCode,
            panNumber: employee?.personalDetails.panNumber,
            aadharNumber: employee?.personalDetails.aadharNumber,
            gender: employee?.personalDetails.gender,
            message: "Profile fetched successfully",
          }
        } catch (error:any) {
            throw new Error("Error generating new access token: " + error.message);
          
        }
  }

  async getPersonalInfo(employeeId: string): Promise<IGetProfileDTO> {
        try {
          const employee = await this._employeeRepository.getProfile(employeeId);
          if (!employee) {
            throw new Error("Employee not found");
          }
          return {
            employeeName: employee?.personalDetails.employeeName,
            email: employee?.personalDetails.email,
            phone: employee?.personalDetails.phone,
            profilePicture: employee.personalDetails.profilePicture ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employee.personalDetails.profilePicture}` :employee.personalDetails.profilePicture ,
            personalWebsite: employee?.personalDetails.personalWebsite,
            bankAccountNumber: employee?.personalDetails.bankAccountNumber,
            ifscCode: employee?.personalDetails.ifscCode,
            panNumber: employee?.personalDetails.panNumber,
            aadharNumber: employee?.personalDetails.aadharNumber,
            gender: employee?.personalDetails.gender,
            message: "Profile fetched successfully",
          }
        } catch (error:any) {
            throw new Error("Error generating new access token: " + error.message);
          
        }
  }

  async getAddress(employeeId: string): Promise<IGetAddressDTO> {
        try {
          const employee = await this._employeeRepository.getProfile( employeeId);
          return {
            street: employee?.address.street,
            city: employee?.address.city,
            state: employee?.address.state,
            country: employee?.address.country,
            postalCode: employee?.address.postalCode,
          }
        } catch (error:any) {
            throw new Error("Error generating new access token: " + error.message);
      } 
       
  }

     
  async getEmployeeProfessionalInfo(employeeId: string): Promise<IGetEmployeeProfessionalDTO> {
    try {
      const employee = await this._employeeRepository.getProfile(employeeId);
      if (!employee) {throw new Error("Employee not found")}
      return {
        position:employee?.professionalDetails.position, 
        department:employee?.professionalDetails.department || "No department", 
        workTime:employee?.professionalDetails.workTime, 
        joiningDate:employee?.professionalDetails.joiningDate,
        currentStatus: employee?.professionalDetails.currentStatus,
        companyName:employee?.professionalDetails.companyName, 
        salary: employee?.professionalDetails.salary,
        uanNumber: employee?.professionalDetails.uanNumber,
        pfAccount: employee?.professionalDetails.pfAccount,
        esiAccount: employee?.professionalDetails.esiAccount
          
      }
    } catch (error: any) {
      throw new Error("Error generating new access token: " + error.message);
    }
  }

  async getDocuments(employeeId: string): Promise<IGetDocumentDTO> {
    try {
        const employee = await this._employeeRepository.getProfile(employeeId);
        if (!employee) {throw new Error("Employee not found")}
        return {
          documentName:employee?.documents.resume.documentName,     
          documentUrl: employee?.documents.resume.documentUrl,       
          documentSize: employee?.documents.resume.documentSize || "No document",    
          uploadedAt: employee?.documents.resume.uploadedAt
        }
    } catch (error: any) {
       throw new Error("Error generating new access token: " + error.message);
    }
  }

  async getEmployeeCredentials(employeeId: string): Promise<IGetCredentailsDTO> {
    try {
      const employee = await this._employeeRepository.getProfile(employeeId);
      if (!employee) {throw new Error("Employee not found")}
  
      return {
        companyEmail: employee?.employeeCredentials.companyEmail,
        companyPassword: employee?.employeeCredentials.companyPassword,
      }
      
    } catch (error: any) {
      throw new Error("Error generating new access token: " + error.message);
    }
  }

  async updateProfile(employeeId: string, data: any): Promise<IEmployeeResponseDTO> {
    console.log(`profile updatye data is ==>`.bgMagenta, data);
    
        try {
             const rabbitMQMessager = new RabbitMQMessager();
             await rabbitMQMessager.init();

            const employee = await this._employeeRepository.updateProfile(employeeId, data);
            await rabbitMQMessager.sendToMultipleQueues({ employee });

            if (!employee) {throw new Error("Employee not found")}
    
            return { success: true,data: employee.personalDetails,  message: "Profile updated successfully" };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || "An error occurred while updating the profile",};
        }
  }


  async updateProfilePicture(employeeId: string, file: Express.Multer.File): Promise<IEmployeeResponseDTO> {
        try {
          const rabbitMQMessager = new RabbitMQMessager();
          await rabbitMQMessager.init();
          const imageUrl = await this.uploadFileToS3(employeeId, file, "profilePicture");

            const employee = await this._employeeRepository.updateProfilePicture(employeeId, imageUrl);
            if (!employee) {throw new Error("Employee not found")}
            const profilePicture = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employee.personalDetails.profilePicture}`
            await rabbitMQMessager.sendToMultipleQueues({ employee });

    
            return { success: true,data: profilePicture,  message: "Profile updated successfully" };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || "An error occurred while updating the profile",};
        }
  }

  private async getDetails(employeeId: string) {
      if (!employeeId) throw new Error("Business owner ID not found");
      const result = await this._employeeRepository.getProfile(employeeId);
      if (!result) throw new Error("Business owner not found");
      return result;
  }
  
  private async uploadFileToS3(employeeId: string, file: Express.Multer.File, fileType: "profilePicture" | "resume" ) {
      const result = await this.getDetails(employeeId);
      const existingFile = fileType
  
      if (existingFile) {
        const s3Client = new S3Client({ region: 'eu-north-1' });
        await s3Client.send(new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: existingFile }));
      }
  
      const fileUrl = await uploadTosS3(file.buffer, file.mimetype);

      
      return fileUrl
  } 


  async updateAddress(employeeId: string, data: any): Promise<IEmployeeResponseDTO> {
    try {
        const employee = await this._employeeRepository.updateAddress(employeeId, data);
        if (!employee) {throw new Error("Employee not found")}
        return { success: true,data: employee.address,  message: "Address updated successfully" };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred while updating the address",};
    }
  }

  async uploadDocuments(employeeId: string, file: Express.Multer.File, fileType: "resume"): Promise<IGetDocumentDTO> {
  try {
    // Upload file to S3
    const fileKey = await this.uploadFileToS3(employeeId, file, "resume")
    
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;

    const documentData = {
      documentName: fileType,
      documentUrl: fileUrl,
      documentSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedAt: new Date(),
    };

    const updatedManager = await this._employeeRepository.uploadDocuments(employeeId,fileType,documentData);

    return {
      documentName: fileType,
      documentUrl: fileUrl,
      documentSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedAt: new Date(),
    };
  } catch (error) {
    console.error("Error while uploading document:", error);
    throw new Error('Could not upload document.');
  }
  }

  


}