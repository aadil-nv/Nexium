import IBusinessOwnerService from "service/interface/IBusinessOwnerService";
import IBusinessOwnerRepository from "../../repository/interface/IBusinessOwnerRepository";
import { inject, injectable } from "inversify";
import { verifyRefreshToken, generateAccessToken } from "../../utils/jwt";
import { IPersonalDetailsDTO, ICompanyDetailsDTO, IAddressDTO, IResponseDTO, IDocumentDTO } from '../../dto/businessOwnerDTO';
import { uploadTosS3 } from '../../middlewares/multer-s3';
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { ID } from "aws-sdk/clients/s3";
import RabbitMQMessager from "../../events/rabbitmq/implementation/producer";

@injectable()
export default class BusinessOwnerService implements IBusinessOwnerService {
  constructor(@inject("IBusinessOwnerRepository") private _businessOwnerRepository: IBusinessOwnerRepository) {}

  private async getDetails(businessOwnerId: string) {
    if (!businessOwnerId) throw new Error("Business owner ID not found");
    const result = await this._businessOwnerRepository.getDetails(businessOwnerId);
    if (!result) throw new Error("Business owner not found");
    return result;
  }

  private async uploadFileToS3(
    businessOwnerId: string,
    file: Express.Multer.File,
    fileType: "profilePicture" | "companyLogo" | "documents"
  ) {
    const result = await this.getDetails(businessOwnerId);
    const existingFile =
      fileType === "profilePicture"
        ? result.personalDetails.profilePicture
        : fileType === "documents"
        ? result.documents
        : result.companyDetails.companyLogo;
  
    if (existingFile) {
      const s3Client = new S3Client({ region: 'eu-north-1' });
  
      // Handle case where `existingFile` is not a string
      let existingFileKey: string | undefined;
  
      if (typeof existingFile === "string") {
        existingFileKey = existingFile; // Use as-is if it's a string
      } else if (typeof existingFile === "object") {
        // Map `existingFile` to a string identifier
        existingFileKey = (existingFile as any).fileName || (existingFile as any).url || undefined;
      }
  
      if (existingFileKey) {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: existingFileKey,
          })
        );
      }
    }
  
    const fileUrl = await uploadTosS3(file.buffer, file.mimetype);
    console.log("==============fileUrl======================", fileUrl);
  
    return fileUrl;
  }
  
  async setNewAccessToken(refreshToken: string): Promise<IResponseDTO> {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const businessOwnerData = decoded?.businessOwnerData;
      if (!decoded || !businessOwnerData) throw new Error("Invalid or expired refresh token");
      const accessToken = generateAccessToken({ businessOwnerData });
      
      return {accessToken};
    } catch (error) {
      throw new Error("Error generating new access token: " + error);
    }
  }

  async addSubscription(subscriptionData: any): Promise<IResponseDTO> {
    try {
      const newSubscription = await this._businessOwnerRepository.addSubscription(subscriptionData);
      return { success: true, message: "Subscription added successfully!", subscription: newSubscription };
    } catch {
      return { success: false, message: "Could not add subscription." };
    }
  }


  async getPersonalDetails(businessOwnerId: string): Promise<IPersonalDetailsDTO> {
    try {
      const result = await this.getDetails(businessOwnerId);
      const profileImageUrl = result.personalDetails.profilePicture
        ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${result.personalDetails.profilePicture}`
        : "";


      return {
        businessOwnerName: result.personalDetails.businessOwnerName,
        email: result.personalDetails.email,
        phone: result.personalDetails.phone,
        personalWebsite: result.personalDetails.personalWebsite,
        profilePicture: profileImageUrl,
      };
    } catch {
      throw new Error("Error while getting personal details");
    }
  }

  async getCompanyDetails(businessOwnerId: string): Promise<ICompanyDetailsDTO> {
    try {
      const result = await this.getDetails(businessOwnerId);
      const { companyDetails } = result;

       
      return {
        companyName: companyDetails.companyName,
        companyWebsite: companyDetails.companyWebsite,
        companyRegistrationNumber: companyDetails.companyRegistrationNumber,
        companyLogo: companyDetails.companyLogo ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${companyDetails.companyLogo}`:companyDetails.companyLogo ,
        companyEmail: companyDetails.companyEmail,
      };
    } catch {
      throw new Error("Error while getting company details");
    }
  }

  async getAddress(businessOwnerId: string): Promise<IAddressDTO> {
    try {
      const result = await this.getDetails(businessOwnerId);
      return {
        street: result.address.street,
        city: result.address.city,
        state: result.address.state,
        country: result.address.country,
        postalCode: result.address.postalCode
      }
    } catch {
      throw new Error("Error while getting address");
    }
  }

  async getDocuments(businessOwnerId: string): Promise<IDocumentDTO> {
    try {
 

     
      
  
      // Fetch document details from the repository
      const documentData = await this._businessOwnerRepository.getDetails(businessOwnerId);

 
 
  
      // Ensure that documentData and documents are valid
      if (!documentData || !documentData.documents || !documentData.documents.companyCertificate) {
 
    
        console.error("No document data found for this business owner");
        throw new Error("No document data found for this business owner");
      }
      
  
      return {
        documentName:documentData.documents.companyCertificate.documentName,
        documentUrl:documentData.documents.companyCertificate.documentUrl,
        documentSize:documentData.documents.companyCertificate.documentSize,
        uploadedAt:documentData.documents.companyCertificate.uploadedAt,

      }
    } catch (error: any) {
      // Log the error and throw a new error with a detailed message
      console.error("Error while fetching documents:", error);
      throw new Error("Error while getting documents: " + error.message);
    }
  }
  
  

  async updatePersonalDetails(businessOwnerId: string, data: any): Promise<IResponseDTO> {

    try {
      const rabbitMQMessager = new RabbitMQMessager();
      await rabbitMQMessager.init();
      const updatedBusinessOwnerData = await this._businessOwnerRepository.updateDetails(businessOwnerId, data);
      console.log("updatedBusinessOwnerData", updatedBusinessOwnerData);
      
      await rabbitMQMessager.sendToMultipleQueues({ updatedBusinessOwnerData });
      return { success: true, message: "Personal details updated successfully!" };
    } catch (error:any) {
      throw new Error(error.message || "Error while updating personal details");
    }
  }

  async updateCompanyDetails(businessOwnerId: string, data: any): Promise<ICompanyDetailsDTO> {
    try {
     const result = await this._businessOwnerRepository.updateCompanyDetails(businessOwnerId, data);
     
     if(!result) throw new Error("Error while updating company details");
      return {
        companyName: result.companyDetails.companyName,
        companyLogo: result.companyDetails.companyLogo,
        companyRegistrationNumber: result.companyDetails.companyRegistrationNumber,
        companyEmail: result.companyDetails.companyEmail,
        companyWebsite: result.companyDetails.companyWebsite
      }
    } catch (error:any) {
      throw new Error(error.message || "Error while updating company details");
    }
  }

  async updateAddress(businessOwnerId: string, data: any): Promise<IResponseDTO> {
    try {
      await this._businessOwnerRepository.updateAddress(businessOwnerId, data);
      return { success: true, message: "Address updated successfully!" };
    } catch (error:any) {
      throw new Error(error.message || "Error while updating address");
  }
  }
  async uploadImages(businessOwnerId: string, file: Express.Multer.File): Promise<IResponseDTO> {
    try {
      const imageUrl = await this.uploadFileToS3(businessOwnerId, file, "profilePicture");

      console.log("==============imageUrl======================", imageUrl);
      
      await this._businessOwnerRepository.uploadImages(businessOwnerId, imageUrl);
      return { success: true, message: 'Image uploaded successfully!', data: { imageUrl:`https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${imageUrl}` } };
    } catch (error:any) {
      throw new Error(error.message || 'Error while uploading image');
    }
  }

  async uploadLogo(businessOwnerId: string, file: Express.Multer.File): Promise<IResponseDTO> {
    try {
      const imageUrl = await this.uploadFileToS3(businessOwnerId, file, "companyLogo");
      await this._businessOwnerRepository.uploadLogo(businessOwnerId, imageUrl);

      return { success: true, message: 'Logo uploaded successfully!', data: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${imageUrl}` 
     };
    } catch (error:any) {
      throw new Error(error.message || 'Error while uploading logo');
    }
  }


  async uploadDocuments(businessOwnerId: string,file: Express.Multer.File,documentType: string): Promise<any> {


    try {
      const fileKey = await this.uploadFileToS3(businessOwnerId, file, "documents");

      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
      
  
      const documentData = {
        documentName: documentType,
        documentUrl: fileUrl,
        documentSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedAt: new Date(),
      };
  
      const updatedBusinessOwner = await this._businessOwnerRepository.uploadDocuments(businessOwnerId,documentType,documentData);      
  
      return {
        documentName: documentType,
        documentUrl: fileUrl,
        documentSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedAt: new Date(),
      };
    } catch (error) {
      console.error("Error while uploading document:", error);
      throw new Error('Could not upload document.');
    }
  }

  async  addServiceRequest(businessOwnerId: string, data: any): Promise<IResponseDTO> {
    console.log("addServiceRequest===============================from service request",data);
    
    try {
      const businessOwnerData = await this._businessOwnerRepository.findOne({ _id: businessOwnerId });
      console.log("Business Owner Data:v from service", businessOwnerData);
      
      if (!businessOwnerData) {
        throw new Error("Business owner not found");
      }
      const result = await this._businessOwnerRepository.addServiceRequest(businessOwnerId,businessOwnerData, data);
      console.log("Service Request Result:", result);
      
      return { success: true, message: "Service request added successfully!", data: result };
    } catch (error:any) {
      throw new Error(error.message || "Error while adding service request");
    }
  }
  async getAllServiceRequests(businessOwnerId: string): Promise<any[]> {
    try {
      const result = await this._businessOwnerRepository.getAllServiceRequests(businessOwnerId);
      return result;
    } catch (error:any) {
      throw new Error(error.message || "Error while getting service requests");
  }
  }

  async updateServiceRequest(serviceRequestId: string, data: any): Promise<IResponseDTO> {
    try {
      const result = await this._businessOwnerRepository.updateServiceRequest(serviceRequestId, data);
      return { success: true, message: "Service request updated successfully!", data: result };
    } catch (error:any) {
      throw new Error(error.message || "Error while updating service request");
    }
  }

  async updateLastSeen(businessOwnerId: string): Promise<IResponseDTO> {
    try {
      const result = await this._businessOwnerRepository.updateLastSeenForChats(businessOwnerId);
      return { success: true, message: "Last seen updated successfully!", data: result };
    } catch (error:any) {
      throw new Error(error.message || "Error while updating last seen");
    }
  }

  async updateIsActive(businessOwnerId: string , isActive: boolean): Promise<IResponseDTO> {
    try {
      const result = await this._businessOwnerRepository.updateIsActive(businessOwnerId , isActive);
      return { success: true, message: "Is active updated successfully!", data: result };
    } catch (error:any) {
      throw new Error(error.message || "Error while updating is active");
    }
  }
  
}
