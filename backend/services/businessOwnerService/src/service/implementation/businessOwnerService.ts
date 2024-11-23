import IBusinessOwnerService from "service/interface/IBusinessOwnerService";
import IBusinessOwnerRepository from "../../repository/interface/IBusinessOwnerRepository";
import { inject, injectable } from "inversify";
import { verifyRefreshToken, generateAccessToken } from "../../utils/jwt";
import {IPersonalDetailsDTO ,ICompanyDetailsDTO ,IAddressDTO, IDocumentsDTO ,IResponseDTO} from '../../dto/businessOwnerDTO'
import {uploadTosS3} from '../../middlewares/multer-s3'
import { S3Client, GetObjectCommand ,DeleteObjectCommand } from "@aws-sdk/client-s3";


@injectable()
export default class BusinessOwnerService implements IBusinessOwnerService {
  private _businessOwnerRepository: IBusinessOwnerRepository;

  constructor(@inject("IBusinessOwnerRepository") businessOwnerRepository: IBusinessOwnerRepository) {
    this._businessOwnerRepository = businessOwnerRepository;
  }

  async registerBusinessOwner(businessOwnerData: string): Promise<any> {
    console.log(`businessowner data: ${businessOwnerData}`.bgRed);
    
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

      if (!decoded || !businessOwnerData) {
        throw new Error("Invalid or expired refresh token");
      }

      return generateAccessToken({ businessOwnerData });
    } catch (error) {
      throw new Error("Error generating new access token: " + error);
    }
  }

  async addSubscription(subscriptionData: any): Promise<any> {
    try {
      const newSubscription = await this._businessOwnerRepository.addSubscription(subscriptionData);
      return { success: true, message: "Subscription added successfully!", subscription: newSubscription };
    } catch (error) {
      return { success: false, message: "Could not add subscription due to an internal error." };
    }
  }

  // async getPersonalDetails(refreshToken: string): Promise<IPersonalDetailsDTO> {
  //   try {
  //     const decoded = verifyRefreshToken(refreshToken);
  //     const businessOwnerId = decoded?.businessOwnerData?._id;
  
  //     if (!businessOwnerId) throw new Error("Invalid token: Business owner ID not found");
  
  //     const result = await this._businessOwnerRepository.getDetails(businessOwnerId);
  //     if (!result) throw new Error("Business owner not found");

  //     const profileImage = result.personalDetails.profileImage;
  
  //     return {
  //       businessOwnerName: result.personalDetails.businessOwnerName,
  //       email: result.personalDetails.email,
  //       phone: result.personalDetails.phone,
  //       personalWebsite: result.personalDetails.personalWebsite,
  //       profileImage: result.personalDetails.profileImage || "",
  //     };
  
  //   } catch (error) {
  //     console.error("Error while getting personal details", error);
  //     throw new Error("Error while getting personal details");
  //   }
  // }



async getPersonalDetails(refreshToken: string): Promise<IPersonalDetailsDTO> {
    try {
        // Decode the refresh token to get the business owner ID
        const decoded = verifyRefreshToken(refreshToken);
        const businessOwnerId = decoded?.businessOwnerData?._id;

        if (!businessOwnerId) throw new Error("Invalid token: Business owner ID not found");

        // Fetch the business owner details from the repository
        const result = await this._businessOwnerRepository.getDetails(businessOwnerId);
        if (!result) throw new Error("Business owner not found");

        // Get the profile image ID from the result
        const profileImageId = result.personalDetails.profileImage;

        // If profile image ID exists, generate the S3 URL
        let profileImageUrl = "";
        if (profileImageId) {
            const s3Client = new S3Client({
                region: 'eu-north-1', // Adjust region as per your S3 bucket's region
            });

            // Assuming the bucket name is 'project-nexium'
            const bucketName = "project-nexium";
            const key = profileImageId;

            // Generate the S3 URL for the image
            profileImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;

            // Optionally, you can directly fetch the image data from S3
            // const getObjectParams = {
            //     Bucket: bucketName,
            //     Key: key,
            // };
            // const command = new GetObjectCommand(getObjectParams);
            // const data = await s3Client.send(command);
            // You can then process the data if needed (e.g., stream the image)
        }

        // Return the personal details, including the profile image URL
        return {
            businessOwnerName: result.personalDetails.businessOwnerName,
            email: result.personalDetails.email,
            phone: result.personalDetails.phone,
            personalWebsite: result.personalDetails.personalWebsite,
            profileImage: profileImageUrl , // Return the image URL or an empty string if not available
        };
    } catch (error) {
        console.error("Error while getting personal details", error);
        throw new Error("Error while getting personal details");
    }
}

  async getCompanyDetails(refreshToken: string): Promise<ICompanyDetailsDTO> {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const businessOwnerId = decoded?.businessOwnerData?._id;
  
      if (!businessOwnerId) throw new Error("Invalid token: Business owner ID not found");
  
      const result = await this._businessOwnerRepository.getDetails(businessOwnerId);
      if (!result) throw new Error("Business owner not found");
  
      return {
        companyName: result.companyDetails.companyName,
        companyWebsite: result.companyDetails.companyWebsite,
        companyRegistrationNumber: result.companyDetails.companyRegistrationNumber,
        companyLogo: result.companyDetails.companyLogo,
        companyEmail: result.companyDetails.companyEmail,
      }
      
    } catch (error) {
      console.error("Error while getting company details", error);
      throw new Error("Error while getting company details");
      
    }
  }

  async getAddress(refreshToken: string): Promise<IAddressDTO> {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const businessOwnerId = decoded?.businessOwnerData?._id;
  
      if (!businessOwnerId) throw new Error("Invalid token: Business owner ID not found");
  
      const result = await this._businessOwnerRepository.getDetails(businessOwnerId);
      if (!result) throw new Error("Business owner not found");
  
      return {
        streetAddress: result.address.streetAddress,
        city: result.address.city,
        state: result.address.state,
        country: result.address.country,
        postalCode: result.address.postalCode,
      };
    } catch (error) {
      console.error("Error while getting address", error);
      throw new Error("Error while getting address");
    }
  }

  async getDocuments(refreshToken: string): Promise<IDocumentsDTO> {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const businessOwnerId = decoded?.businessOwnerData?._id;
  
      if (!businessOwnerId) throw new Error("Invalid token: Business owner ID not found");
  
      const result = await this._businessOwnerRepository.getDetails(businessOwnerId);
      if (!result) throw new Error("Business owner not found");
  
      return {
        companyIncorporationDocument: result.companyDetails.documents.companyIncorporationDocument,
        businessOwnerIdProof: result.companyDetails.documents.businessOwnerIdProof
      };
    } catch (error) {
      console.error("Error while getting documents", error);
      throw new Error("Error while getting documents");
    }
  }
  
  async updatePersonalDetails(refreshToken: string, data: any): Promise<IResponseDTO> {
    try {
        const decoded = verifyRefreshToken(refreshToken);
        const businessOwnerId = decoded?.businessOwnerData?._id;
        if (!businessOwnerId) throw new Error("Invalid token: Business owner ID not found");

        await this._businessOwnerRepository.updateDetails(businessOwnerId, data);
        return { success: true, message: "Personal details updated successfully!" };
    } catch (error: any) {
        console.error("Error updating personal details:", error);
        throw new Error(error.message || "Error while updating personal details");
    }
}

  
  async uploadImages(refreshToken: string, file: Express.Multer.File): Promise<any> {
    try {
        const decoded = verifyRefreshToken(refreshToken);
        const businessOwnerId = decoded?.businessOwnerData?._id;
        if (!businessOwnerId) throw new Error('Invalid token: Business owner ID not found');
        if (!file?.buffer || !file?.mimetype) throw new Error('Invalid file uploaded');

        const result = await this._businessOwnerRepository.getDetails(businessOwnerId);
        if (!result) throw new Error("Business owner not found");

        const existingProfileImage = result.personalDetails?.profileImage;
        if (existingProfileImage) {
            const s3Client = new S3Client({ region: 'eu-north-1' });
            const bucketName = "project-nexium";

            await s3Client.send(new DeleteObjectCommand({
                Bucket: bucketName,
                Key: existingProfileImage,
            })).catch((err) => {
                console.error("Error deleting old image from S3", err);
                throw new Error("Error deleting old image from S3");
            });
        }

        const fileUrl = await uploadTosS3(file.buffer, file.mimetype);
        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileUrl}`;
        await this._businessOwnerRepository.uploadImages(businessOwnerId, fileUrl);

        return { success: true, message: 'Image uploaded successfully!', data: { imageUrl } };
    } catch (error: any) {
        console.error('Error while uploading image:', error);
        throw new Error(error.message || 'Error while uploading image');
    }
}

  
  

}
