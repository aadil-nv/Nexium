import IBusinessOwnerService from "service/interface/IBusinessOwnerService";
import IBusinessOwnerRepository from "../../repository/interface/IBusinessOwnerRepository";
import { inject, injectable } from "inversify";
import { verifyRefreshToken, generateAccessToken } from "../../utils/jwt";
import { IPersonalDetailsDTO, ICompanyDetailsDTO, IAddressDTO, IDocumentsDTO, IResponseDTO } from '../../dto/businessOwnerDTO';
import { uploadTosS3 } from '../../middlewares/multer-s3';
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

@injectable()
export default class BusinessOwnerService implements IBusinessOwnerService {
  constructor(@inject("IBusinessOwnerRepository") private _businessOwnerRepository: IBusinessOwnerRepository) {}

  async registerBusinessOwner(businessOwnerData: string): Promise<any> {
    try {
      return await this._businessOwnerRepository.registerBusinessOwner(businessOwnerData);
    } catch (error) {
      throw new Error("Error while registering business owner");
    }
  }

  async setNewAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const businessOwnerData = decoded?.businessOwnerData;
      if (!decoded || !businessOwnerData) throw new Error("Invalid or expired refresh token");
      return generateAccessToken({ businessOwnerData });
    } catch (error) {
      throw new Error("Error generating new access token: " + error);
    }
  }

  async addSubscription(subscriptionData: any): Promise<any> {
    try {
      const newSubscription = await this._businessOwnerRepository.addSubscription(subscriptionData);
      return { success: true, message: "Subscription added successfully!", subscription: newSubscription };
    } catch {
      return { success: false, message: "Could not add subscription." };
    }
  }

  private async getDetails(businessOwnerId: string) {
    if (!businessOwnerId) throw new Error("Business owner ID not found");
    const result = await this._businessOwnerRepository.getDetails(businessOwnerId);
    if (!result) throw new Error("Business owner not found");
    return result;
  }

  async getPersonalDetails(businessOwnerId: string): Promise<IPersonalDetailsDTO> {
    try {
      const result = await this.getDetails(businessOwnerId);
      const profileImageUrl = result.personalDetails.profileImage
        ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${result.personalDetails.profileImage}`
        : "";
      return {
        businessOwnerName: result.personalDetails.businessOwnerName,
        email: result.personalDetails.email,
        phone: result.personalDetails.phone,
        personalWebsite: result.personalDetails.personalWebsite,
        profileImage: profileImageUrl,
      };
    } catch {
      throw new Error("Error while getting personal details");
    }
  }

  async getCompanyDetails(businessOwnerId: string): Promise<ICompanyDetailsDTO> {
    try {
      const result = await this.getDetails(businessOwnerId);
      const { companyDetails } = result;
      const companyLogoUrl = companyDetails.companyLogo
        ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${companyDetails.companyLogo}`
        : "";
      return {
        companyName: companyDetails.companyName,
        companyWebsite: companyDetails.companyWebsite,
        companyRegistrationNumber: companyDetails.companyRegistrationNumber,
        companyLogo: companyLogoUrl,
        companyEmail: companyDetails.companyEmail,
      };
    } catch {
      throw new Error("Error while getting company details");
    }
  }

  async getAddress(businessOwnerId: string): Promise<IAddressDTO> {
    try {
      const result = await this.getDetails(businessOwnerId);
      return result.address;
    } catch {
      throw new Error("Error while getting address");
    }
  }

  async getDocuments(businessOwnerId: string): Promise<IDocumentsDTO> {
    try {
      const result = await this.getDetails(businessOwnerId);
      return result.companyDetails.documents;
    } catch {
      throw new Error("Error while getting documents");
    }
  }

  async updatePersonalDetails(businessOwnerId: string, data: any): Promise<IResponseDTO> {
    try {
      await this._businessOwnerRepository.updateDetails(businessOwnerId, data);
      return { success: true, message: "Personal details updated successfully!" };
    } catch (error:any) {
      throw new Error(error.message || "Error while updating personal details");
    }
  }

  private async uploadFileToS3(businessOwnerId: string, file: Express.Multer.File, fileType: "profileImage" | "companyLogo") {
    const result = await this.getDetails(businessOwnerId);
    const existingFile = fileType === "profileImage" ? result.personalDetails.profileImage : result.companyDetails.companyLogo;

    if (existingFile) {
      const s3Client = new S3Client({ region: 'eu-north-1' });
      await s3Client.send(new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: existingFile }));
    }

    const fileUrl = await uploadTosS3(file.buffer, file.mimetype);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileUrl}`;
  }

  async uploadImages(businessOwnerId: string, file: Express.Multer.File): Promise<any> {
    try {
      const imageUrl = await this.uploadFileToS3(businessOwnerId, file, "profileImage");
      await this._businessOwnerRepository.uploadImages(businessOwnerId, imageUrl);
      return { success: true, message: 'Image uploaded successfully!', data: { imageUrl } };
    } catch (error:any) {
      throw new Error(error.message || 'Error while uploading image');
    }
  }

  async uploadLogo(businessOwnerId: string, file: Express.Multer.File): Promise<any> {
    try {
      const imageUrl = await this.uploadFileToS3(businessOwnerId, file, "companyLogo");
      await this._businessOwnerRepository.uploadLogo(businessOwnerId, imageUrl);
      return { success: true, message: 'Logo uploaded successfully!', data: imageUrl };
    } catch (error:any) {
      throw new Error(error.message || 'Error while uploading logo');
    }
  }
}
