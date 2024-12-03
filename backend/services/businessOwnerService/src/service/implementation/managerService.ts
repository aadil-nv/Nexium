import IManagerRepository from "../../repository/interface/IManagerReopsitory";
import IManagerService from "../interface/IManagerService";
import { inject, injectable } from "inversify";
import createManagerCredentials from "../../utils/generateManagerCredentials";
import generateOfferLetter from "../../utils/generateOfferLetter";
import nodemailer from "nodemailer";
import RabbitMQMessager from "../../events/rabbitmq/implementation/producer";
import { IResponseDTO } from "dto/businessOwnerDTO";
import { IManager } from "entities/managerEntity";
import { uploadTosS3 } from '../../middlewares/multer-s3';
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";


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

  constructor(@inject("IManagerRepoitory") managerRepository: IManagerRepository) {
    this._managerRepository = managerRepository;
  }

  async addManagers(businessOwnerId: string, data: any): Promise<IResponseDTO> {
    console.log(`===================`.bgCyan.bold, data);

    try {
        const rabbitMQMessager = new RabbitMQMessager();
        await rabbitMQMessager.init();


        this.validateManagerData(data);

 
        const businessOwnerData = await this._managerRepository.findById(businessOwnerId);
        if (!businessOwnerData) throw new Error("Business owner not found");

        // Check if a manager with the same email already exists
        const existingEmail = await this._managerRepository.findByEmail(businessOwnerId, data.email);
        if (existingEmail) throw new Error("Manager with this email already exists");

        // Generate manager credentials
        const managerCredentials = createManagerCredentials(
            businessOwnerData.companyDetails.companyName,
            businessOwnerId,
            data.name
        );
        console.log(`managerCredentials:`.bgWhite, managerCredentials);

        // Prepare `managerData` structure
        const newManagerData: any = {
            personalDetails: {
                managerName: data.name,
                email: data.email,
                personalWebsite: '', // Default value
                profilePicture: data.profileImage || "",
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
                companyLogo: data.companyLogo || undefined,
            },
            managerCredentials: {
                companyEmail: managerCredentials.managerCredentials.email,
                companyPassword: managerCredentials.managerCredentials.password,
            },
            address: {
              street: "",
              city: "",
              state: "",
              zip: "",
              country:"",
            },
            documents: [
              {
                documentName: "HR Document", // Default name
                documentUrl: "https://example.com/default-document", // Default URL
                uploadedAt: new Date(), // Default timestamp
              },
            ],
            businessOwnerId,
            subscriptionId: businessOwnerData.subscription.subscriptionId,
        };

        console.log(`Prepared Manager Data:`, newManagerData);

        // Send offer letter
        await this.sendOfferLetter(data.name, managerCredentials.managerCredentials, data.email);

        // Add the manager to the database
        const managerData = await this._managerRepository.addManagers(businessOwnerId, newManagerData);

        // Send the new manager data to RabbitMQ for further processing
        rabbitMQMessager.sendToMultipleQueues({ managerData });

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
    // Validate manager name
    if (!data.name || data.name.length < 3) throw new Error("Manager name must be at least 3 characters long");
    console.log(`Manager Name: ${data.name}`.green);
  
    // Validate email format
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) throw new Error("Invalid email address");
    console.log(`Manager Email: ${data.email}`.blue);
  
    // Validate phone number
    if (!data.phoneNumber || !/^\d{10}$/.test(data.phoneNumber)) throw new Error("Phone number must be exactly 10 digits");
    if (/(.)\1{2,}/.test(data.phoneNumber)) throw new Error("Phone number must not have consecutive numbers");
    console.log(`Manager Phone Number: ${data.phoneNumber}`.yellow);
  
    // Validate joining date (should not be in the past)
    if (!data.joiningDate || new Date(data.joiningDate) < new Date()) {
      console.log(`Invalid Joining Date: ${data.joiningDate}`.bgRed);
      throw new Error("Joining date must be today or a future date");
    }
    console.log(`Manager Joining Date: ${data.joiningDate}`.cyan);
  
    // Validate salary (must be a positive number and an integer)
    // if (typeof data.salary !== 'number' || data.salary <= 0) throw new Error("Salary must be a positive number");
    // console.log(`Manager Salary: ${data.salary}`.magenta);
  
    // Validate work time and manager type
    if (!data.workTime) throw new Error("Work time is required");
    if (!data.managerType) throw new Error("Manager type is required");
  
    console.log(`Work Time: ${data.workTime}`.green);
    console.log(`Manager Type: ${data.managerType}`.blue);
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

  async getAllManagers(businessOwnerId: string): Promise<any[]> {
    try {
      return await this._managerRepository.getAllManagers(businessOwnerId);
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
  
      console.log("Manager block status toggled:", response);
      console.log("1111111111111111111111111111111111");
      
      
      await rabbitMQMessager.sendToMultipleQueues({ isBlocked:managerData });
      console.log("222222222222222222222222222222222222");
  
      return {
        success: true,
        message: "Manager block status toggled successfully!",
      };
    } catch (error: any) {
      console.error("Error toggling manager block status:", error);
  
      // Add specific error names for handling in the controller
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

  async getManager(businessOwnerId: string, managerId: string): Promise<IManager> {
    try {
     const reult = await this._managerRepository.findManagerById(managerId ,businessOwnerId);
     if(!reult){
      throw new Error("Manager not found");
     }
     return reult;
    } catch (error) {
      console.error("Error fetching manager:", error);
      throw error;
    }
  }

  async updatePersonalInfo(businessOwnerId: string, managerId: string, data: any): Promise<IManager> {
    try {
     const result = await this._managerRepository.updatePersonalInfo(businessOwnerId, managerId, data);

      console.log("Updated manager:======================", result);
      
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

     console.log("Updated manager:=======address===============", result);
     
     return result;
    } catch (error) {
      console.error("Error updating manager:", error);
      throw error;
    }
  }

  async uploadProfilePic(businessOwnerId: string, managerId: string, file: Express.Multer.File): Promise<IManager> {
    try {
      const imageUrl = await this.uploadFileToS3(businessOwnerId,managerId, file, "companyLogo");
     const result = await this._managerRepository.uploadProfilePic(businessOwnerId, managerId, imageUrl);
     if(!result){
      throw new Error("Manager not found");
     }
     return result;
    } catch (error) {
      console.error("Error updating manager:", error);
      throw error;
    }
  }

  private async uploadFileToS3(businessOwnerId: string,managerId: string, file: Express.Multer.File, fileType: "profileImage" | "companyLogo") {
    const result = await this.getDetails(businessOwnerId ,managerId);
    const existingFile = fileType === "profileImage" ? result.personalDetails.profilePicture : result.companyDetails.companyLogo;

    if (existingFile) {
      const s3Client = new S3Client({ region: 'eu-north-1' });
      await s3Client.send(new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: existingFile }));
    }

    const fileUrl = await uploadTosS3(file.buffer, file.mimetype);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileUrl}`;
  }

  private async getDetails(businessOwnerId: string , managerId : string) {
    if (!businessOwnerId) throw new Error("Business owner ID not found");
    const result = await this._managerRepository.getDetails(businessOwnerId ,managerId);
    if (!result) throw new Error("Business owner not found");
    return result;
  }
  
}
