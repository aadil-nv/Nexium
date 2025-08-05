import IManagerRepository from "../../repository/interface/IManagerReopsitory";
import IManagerService from "../interface/IManagerService";
import { inject, injectable } from "inversify";
import createManagerCredentials from "../../utils/generateManagerCredentials";
import generateOfferLetter from "../../utils/generateOfferLetter";
import nodemailer from "nodemailer";
import RabbitMQMessager from "../../events/rabbitmq/implementation/producer";
import { IResponseDTO } from "dto/businessOwnerDTO";
import { IManager } from "entities/managerEntity";
import { getSignedImageURL, uploadTosS3 } from '../../middlewares/multer-s3';
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { ManagerDTO } from "../../dto/managerDTO";


const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

@injectable()
export default class ManagerService implements IManagerService {
  private _managerRepository: IManagerRepository;

  constructor(@inject("IManagerRepository") managerRepository: IManagerRepository) {
    this._managerRepository = managerRepository;
  }

  async addManagers(businessOwnerId: string, data: any): Promise<IResponseDTO> {

    try {


        this.validateManagerData(data);
 
        const businessOwnerData = await this._managerRepository.findById(businessOwnerId);
        if (!businessOwnerData) throw new Error("Business owner not found");

        const existingEmail = await this._managerRepository.findByEmail(businessOwnerId, data.email);
        if (existingEmail) throw new Error("Manager with this email already exists");

        const managerCredentials = createManagerCredentials(
            businessOwnerData.companyDetails.companyName,
            businessOwnerId,
            data.name
        );


        const newManagerData: any = {
            personalDetails: {
                managerName: data.name,
                email: data.email,
                personalWebsite: '',
                phone: data.phoneNumber,
            },
            professionalDetails: {
                managerType: data.managerType,
                joiningDate: data.joiningDate || new Date(),
                salary: data.salary,
                workTime: data.workTime,
            },
            companyDetails: {
                companyName: businessOwnerData.companyDetails.companyName,
                companyLogo: businessOwnerData.companyDetails.companyLogo,
            },
            managerCredentials: {
                companyEmail: managerCredentials.managerCredentials.email,
                companyPassword: managerCredentials.managerCredentials.password,
            },
            address: {
              street: "",
              city: "",
              state: "",
              postalCode: "",
              country:"",
            },
            businessOwnerId,
            subscriptionId: businessOwnerData.subscription.subscriptionId,
        };


        await this.sendOfferLetter(data.name, managerCredentials.managerCredentials, data.email);

        const managerData = await this._managerRepository.addManagers(businessOwnerId, newManagerData);

        return {
          success:true,
          message:"Manager added successfully"
        }
    } catch (error: any) {
        console.error("Error adding HR Manager:", error.message.bgRed);
        throw new Error(error.message || "Error adding HR Manager");
    }
 }

  
  private validateManagerData(data: any): void {
    if (!data.name || data.name.length < 3) throw new Error("Manager name must be at least 3 characters long");
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) throw new Error("Invalid email address");
    if (!data.phoneNumber || !/^\d{10}$/.test(data.phoneNumber)) throw new Error("Phone number must be exactly 10 digits");
    if (/(.)\1{2,}/.test(data.phoneNumber)) throw new Error("Phone number must not have consecutive numbers");
    if (!data.joiningDate || new Date(data.joiningDate) < new Date()) {
      throw new Error("Joining date must be today or a future date");
    }
    if (!data.workTime) throw new Error("Work time is required");
    if (!data.managerType) throw new Error("Manager type is required");
  
  }
  
  
  async sendOfferLetter(managerName: string, managerCredentials: any, managerEmail: string): Promise<void> {
    try {
      const offerLetterContent = generateOfferLetter(managerName, managerCredentials);
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: managerEmail,
        subject: `Offer Letter for ${managerCredentials.companyName} Manager`,
        html: offerLetterContent,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Offer letter sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending offer letter:", error);
      throw new Error("Failed to send offer letter. Please try again later.");
    }
  }

  async getAllManagers(businessOwnerId: string): Promise<ManagerDTO[]> {
    try {
      const managerData = await this._managerRepository.getAllManagers(businessOwnerId);
      const mappedManagers: any = managerData.map(manager => ({
        personalDetails: {
          managerName: manager.personalDetails.managerName.toString(),
          personalWebsite: manager.personalDetails.personalWebsite?.toString(), // Provide default value
          email: manager.personalDetails.email,
          profilePicture: manager.personalDetails.profilePicture ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${manager.personalDetails.profilePicture}`: manager.personalDetails.profilePicture, // Provide default value
          phone: manager.personalDetails.phone,
        },
        professionalDetails: {
          managerType: manager.professionalDetails.managerType,
          workTime: manager.professionalDetails.workTime,
          joiningDate: manager.professionalDetails.joiningDate || new Date(),
          salary: manager.professionalDetails.salary,
        },
        address: {
          street: manager.address.street,
          city: manager.address.city,
          state: manager.address.state,
          country: manager.address.country,
          postalCode: manager.address.postalCode,
        },
        companyDetails: {
          companyName: manager.companyDetails.companyName,
          companyLogo: manager.companyDetails.companyLogo || '', 
        },
        managerCredentials: {
          companyEmail: manager.managerCredentials.companyEmail,
          companyPassword: manager.managerCredentials.companyPassword,
        },
        _id: manager._id,
        isActive: manager.isActive,
        isVerified: manager.isVerified,
        isBlocked: manager.isBlocked,
        businessOwnerId: manager.businessOwnerId,
        createdAt: manager.createdAt,
        updatedAt: manager.updatedAt,
        documents: manager.documents,
      }));

      return mappedManagers; 
    } catch (error) {
      console.error("Error fetching managers:", error);
      throw error;
    }
  }
  
  
  
  async blockManager(businessOwnerId: string, managerData: any): Promise<IResponseDTO> {
    try {
      const rabbitMQMessager = new RabbitMQMessager();
        await rabbitMQMessager.init();
      
      if (!businessOwnerId || !managerData) {
        throw new Error("Invalid input: Business Owner ID or Manager Data is missing.");
      }
  
      const response = await this._managerRepository.blockManager(businessOwnerId, managerData);
      
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

  async getManager(businessOwnerId: string, managerId: string): Promise<ManagerDTO> {
    try {
      const result = await this._managerRepository.findManagerById(managerId, businessOwnerId);
  
      if (!result) {
        throw new Error("Manager not found");
      }
  
      const managerDTO: ManagerDTO = {
        personalDetails: {
          managerName: result.personalDetails.managerName,
          ...(result.personalDetails.personalWebsite && { personalWebsite: result.personalDetails.personalWebsite }),
          email: result.personalDetails.email,
          ...(result.personalDetails.profilePicture  && { profilePicture: result.personalDetails.profilePicture ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${result.personalDetails.profilePicture}` : result.personalDetails.profilePicture }),
          phone: result.personalDetails.phone,
        },
        professionalDetails: {
          managerType: result.professionalDetails.managerType,
          workTime: result.professionalDetails.workTime,
          ...(result.professionalDetails.joiningDate && { joiningDate: result.professionalDetails.joiningDate }),
          ...(result.professionalDetails.managerType && { designation: result.professionalDetails.managerType }),
          salary: result.professionalDetails.salary,
        },
        ...(result.address && {
          address: {
            ...(result.address.street && { street: result.address.street }),
            ...(result.address.city && { city: result.address.city }),
            ...(result.address.state && { state: result.address.state }),
            ...(result.address.postalCode && { postalCode: result.address.postalCode }),
            ...(result.address.country && { country: result.address.country }),
          },
        }),
        companyDetails: {
          companyName: result.companyDetails.companyName,
          ...(result.companyDetails.companyLogo && { companyLogo: result.companyDetails.companyLogo }),
          companyRegistrationNumber: result.companyDetails.companyRegistrationNumber,
          ...(result.companyDetails.companyWebsite && { companyWebsite: result.companyDetails.companyWebsite }),
        },
        ...(result.documents && {
          documents: {
            resume: {
              documentName: result.documents.resume.documentName,
              documentUrl: result.documents.resume.documentUrl,
              ...(result.documents.resume.documentSize && { documentSize: result.documents.resume.documentSize }),
              uploadedAt: result.documents.resume.uploadedAt,
            },
          },
        }),
        ...(result.managerCredentials && {
          managerCredentials: {
            companyEmail: result.managerCredentials.companyEmail,
            companyPassword: result.managerCredentials.companyPassword,
          },
        }),
        ...(result.isActive !== undefined && { isActive: result.isActive }),
        ...(result.isVerified !== undefined && { isVerified: result.isVerified }),
        ...(result.isBlocked !== undefined && { isBlocked: result.isBlocked }),
        ...(result.businessOwnerId && { businessOwnerId: result.businessOwnerId.toString() }),
        ...(result.subscriptionId && { subscriptionId: result.subscriptionId.toString() }),
        ...(result.createdAt && { createdAt: result.createdAt }),
        ...(result.updatedAt && { updatedAt: result.updatedAt }),
      }
      
      return managerDTO;
    } catch (error) {
      console.error("Error fetching manager:", error);
      throw error;
    }
  }
  

  async updatePersonalInfo(businessOwnerId: string, managerId: string, data: any): Promise<IManager> {
    try {
     const result = await this._managerRepository.updatePersonalInfo(businessOwnerId, managerId, data);
      
     if(!result){
      throw new Error("Manager not found");
     }
     return result;
    } catch (error) {
      console.error("Error updating manager:", error);
      throw error;
    }
  }

  async updateProfessionalInfo(businessOwnerId: string, managerId: string, data: any): Promise<IManager> {
    try {
     const result = await this._managerRepository.updateProfessionalInfo(businessOwnerId, managerId, data);
     if(!result){
      throw new Error("Manager not found");
     }
     return result;
    } catch (error) {
      console.error("Error updating manager:", error);
      throw error;
    }
  }
  
  async updateAddressInfo(businessOwnerId: string, managerId: string, data: any): Promise<IManager> {
    try {
     const result = await this._managerRepository.updateAddressInfo(businessOwnerId, managerId, data);
     if(!result){
      throw new Error("Manager not found");
     }
     
     return result;
    } catch (error) {
      console.error("Error updating manager:", error);
      throw error;
    }
  }

  async uploadProfilePic(businessOwnerId: string, managerId: string, file: Express.Multer.File): Promise<string> {
    
    try {
      const imageUrl = await this.uploadFileToS3(businessOwnerId,managerId, file, "profilePicture");
     const result = await this._managerRepository.uploadProfilePic(businessOwnerId, managerId, imageUrl);
     if(!result){
      throw new Error("Manager not found");
     }
     const profilePicture =getSignedImageURL(result.personalDetails.profilePicture as string ) 
     return profilePicture
    } catch (error) {
      console.error("Error updating manager:", error);
      throw error;
    }
  }

  private async uploadFileToS3(businessOwnerId: string,managerId: string, file: Express.Multer.File, fileType: "profilePicture" | "companyLogo" | "resume"): Promise<string> {
    const result = await this.getDetails(businessOwnerId ,managerId);
    const existingFile = fileType === "profilePicture" ? result.personalDetails.profilePicture : result.companyDetails.companyLogo;

    if (existingFile) {
      const s3Client = new S3Client({ region: 'eu-north-1' });
      await s3Client.send(new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: existingFile }));
    }

    const fileUrl = await uploadTosS3(file.buffer, file.mimetype);
    return fileUrl
  }

  private async getDetails(businessOwnerId: string , managerId : string) {
    if (!businessOwnerId) throw new Error("Business owner ID not found");
    const result = await this._managerRepository.getDetails(businessOwnerId ,managerId);
    if (!result) throw new Error("Business owner not found");
    return result;
  }


  async updateResume(businessOwnerId: string, managerId: string, file: Express.Multer.File): Promise<any> {
    try {
      const fileKey = await this.uploadFileToS3(businessOwnerId,managerId, file, "resume");

      
      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
      
  
      const documentData = {
        documentName: file.originalname,
        documentUrl: fileUrl,
        documentSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedAt: new Date(),
      };
  
      const updatedBusinessOwner = await this._managerRepository.updateResume(businessOwnerId,managerId,documentData);      
  
      return {
        documentName: file.originalname,
        documentUrl: fileUrl,
        documentSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedAt: new Date(),
      };
    } catch (error) {
      console.error("Error updating manager:", error);
      throw error;
    }
  }
}
