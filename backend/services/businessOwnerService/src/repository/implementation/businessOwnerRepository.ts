import { inject, injectable } from "inversify";
import IBusinessOwnerRepository from "../interface/IBusinessOwnerRepository";
import BusinessOwnerModel from "../../models/businessOwnerModel";
import BaseRepository from "../implementation/baseRepository";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntity";
import SubscriptionModel from "../../models/subscriptionModel";
import { IPersonalDetailsDTO } from "dto/businessOwnerDTO";

@injectable()
export default class BusinessOwnerRepository extends BaseRepository<IBusinessOwnerDocument> implements IBusinessOwnerRepository {
  constructor(
    @inject("BusinessOwnerModel") private _businessOwnerModel: typeof BusinessOwnerModel
  ) {
    super(_businessOwnerModel);
  }

  async addSubscription(subscriptionData: any): Promise<any> {
    try {
      const subscription = new SubscriptionModel(subscriptionData);
      return await subscription.save();
    } catch (error) {
      console.error("Error adding subscription:", error);
      throw new Error("Could not add subscription.");
    }
  }

  async getDetails(businessOwnerId: string): Promise<IBusinessOwnerDocument> {
    try {
      const result = await this._businessOwnerModel.findById(businessOwnerId);
      if (!result) {
        throw new Error(`No business owner found with ID: ${businessOwnerId}`);
      }
      return result;
    } catch (error) {
      console.error("Error getting personal details:", error);
      throw new Error("Could not get personal details.");
    }
  }

  async updateDetails(businessOwnerId: string, data: any): Promise<IBusinessOwnerDocument> {
 
  
    try {
      // Define the fields allowed to be updated
      const allowedFields: (keyof IPersonalDetailsDTO)[] = ["businessOwnerName", "email", "personalWebsite", "phone"];
  
      // Extract only the allowed fields from the incoming data
      const updateFields: Partial<IPersonalDetailsDTO> = {};
      for (const key of allowedFields) {
        if (key in data && data[key] !== undefined) {
          updateFields[key] = data[key]; // Only include valid fields
        }
      }
  
      // Ensure that at least one field is being updated
      if (Object.keys(updateFields).length === 0) {
        throw new Error("No valid fields provided for update.");
      }
  
      // Update only the allowed fields in the `personalDetails`
      const result = await this._businessOwnerModel.findByIdAndUpdate(
        businessOwnerId,
        { $set: { 
            "personalDetails.businessOwnerName": updateFields.businessOwnerName,
            "personalDetails.email": updateFields.email,
            "personalDetails.personalWebsite": updateFields.personalWebsite,
            "personalDetails.phone": updateFields.phone
          } },
        { new: true } // Return the updated document
      );

  
      if (!result) {
        throw new Error(`No business owner found with ID: ${businessOwnerId}`);
      }
  
  
      return result;
    } catch (error) {
      console.error("Error updating personal details:", error);
      throw new Error("Could not update personal details.");
    }
  }
  
 
  async uploadImages(businessOwnerId: string, filePath: string): Promise<IBusinessOwnerDocument> {
    
    try {
      const result = await this._businessOwnerModel.findByIdAndUpdate(
        businessOwnerId,
        { $set: { 'personalDetails.profilePicture': filePath } }, // Save the file path
        { new: true }
      );
  
      if (!result) {
        throw new Error(`No business owner found with ID: ${businessOwnerId}`);
      }
  
      return result;
    } catch (error) {
      console.error('Error updating personal details:', error);
      throw new Error('Could not update personal details.');
    }
  }

  async uploadLogo(businessOwnerId: string, filePath: string): Promise<IBusinessOwnerDocument> {
    
    try {
      const result = await this._businessOwnerModel.findByIdAndUpdate(
        businessOwnerId,
        { $set: { 'companyDetails.companyLogo': filePath } }, // Save the file path
        { new: true }
      );
  
      if (!result) {
        throw new Error(`No business owner found with ID: ${businessOwnerId}`);
      }
  

      return result;
    } catch (error) {
      console.error('Error updating personal details:', error);
      throw new Error('Could not update personal details.');
    }
  }
  async findIsBlocked(businessOwnerId: string): Promise<boolean | null> {

    
    try {
      const businessOwner = await this._businessOwnerModel.findById(businessOwnerId);
      if (!businessOwner) {
        return null; // Return null if no businessOwner is found
      }
      return businessOwner.isBlocked ?? null; // Return isBlocked status or null if not available
    } catch (error) {
      console.error("Error finding businessOwner by ID:", error);
      return null; // Return null in case of any error
    }
  }
 
  async updateAddress(businessOwnerId: string, data: any): Promise<IBusinessOwnerDocument> {
    try {
      const result = await this._businessOwnerModel.findByIdAndUpdate(
        businessOwnerId,
        { $set: { 'address': data } }, // Save the file path
        { new: true }
      );
  
      if (!result) {
        throw new Error(`No business owner found with ID: ${businessOwnerId}`);
      }
  
 
      return result;
    } catch (error) {
      console.error('Error updating personal details:', error);
      throw new Error('Could not update personal details.');
    }
  }

  async updateCompanyDetails(businessOwnerId: string, data: any): Promise<IBusinessOwnerDocument> {

    try {
      const result = await this._businessOwnerModel.findByIdAndUpdate(
        businessOwnerId,
        { $set: { 
          'companyDetails.companyName': data.companyName,
          'companyDetails.companyRegistrationNumber': data.companyRegistrationNumber,
           'companyDetails.companyWebsite': data.companyWebsite,
           'companyDetails.companyEmail': data.companyEmail } }, // Save the file path
        { new: true }
      );
  
      if (!result) {
        throw new Error(`No business owner found with ID: ${businessOwnerId}`);
      }
  
   
      return result;
    } catch (error) {
      console.error('Error updating personal details:', error);
      throw new Error('Could not update personal details.');
    }
  }

  async uploadDocuments(businessOwnerId: string, documentType: string, documentData: Object): Promise<IBusinessOwnerDocument> {

  
    try {
      // Validate document type
      if (documentType !== 'companyCertificate') {
        throw new Error(`Invalid document type: ${documentType}`);
      }
  
      // Construct the update data based on documentType
      const updateData = {
        [`documents.${documentType}`]: documentData
      };
  
      const result = await this._businessOwnerModel.findByIdAndUpdate(
        businessOwnerId,
        updateData,
        { new: true }
      );
  
      if (!result) throw new Error(`No business owner found with ID: ${businessOwnerId}`);

      return result;
    } catch (error) {
      console.error('Error updating documents:', error);
      throw new Error('Could not update documents.');
    }
  }
  
  
}
