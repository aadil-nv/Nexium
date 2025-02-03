import { inject, injectable } from "inversify";
import IBusinessOwnerRepository from "../interface/IBusinessOwnerRepository";
import BusinessOwnerModel from "../../models/businessOwnerModel";
import BaseRepository from "../implementation/baseRepository";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntity";
import SubscriptionModel from "../../models/subscriptionModel";
import { IPersonalDetailsDTO } from "../../dto/businessOwnerDTO";
import EmployeeModel from "../../models/employeeModel"
import ManagerModel from "../../models/managerModel"
import mongoose from "mongoose";
import serviceRequestModel from "../../models/serviceRequestModel";
import chatModel from "../../models/chatModel";
import businessOwnerModel from "../../models/businessOwnerModel";

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
      const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
      const allowedFields: (keyof IPersonalDetailsDTO)[] = ["businessOwnerName", "email", "personalWebsite", "phone"];
  
      const updateFields: Partial<IPersonalDetailsDTO> = {};
      for (const key of allowedFields) {
        if (key in data && data[key] !== undefined) {
          updateFields[key] = data[key]; // Only include valid fields
        }
      }
  
      if (Object.keys(updateFields).length === 0) {
        throw new Error("No valid fields provided for update.");
      }
  
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

      
      const businessOwner = _switchDb.model('BusinessOwner', BusinessOwnerModel.schema);
       await businessOwner.findByIdAndUpdate(
        businessOwnerId,
        { $set: result }, // Save the file path
        { new: true }
      );
  
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
      const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
      const businessOwner = _switchDb.model('businessOwners', businessOwnerModel.schema)
      await businessOwner.findByIdAndUpdate(
        businessOwnerId,
        { $set: { 'companyDetails.companyLogo': filePath } }, // Save the file path
        { new: true }
      );

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

  async getDashboardData(companyId: string): Promise<any> {
    try {
      // Switch to the correct database using the companyId
      const _switchDb = mongoose.connection.useDb(companyId, { useCache: true });
  
      // Define the Employee and Manager models for the switched database
      const Employee = _switchDb.model('Employees', EmployeeModel.schema);
      const Manager = _switchDb.model('Managers', ManagerModel.schema);
  
      // Get the total count of employees
      const totalEmployees = await Employee.countDocuments();
  
      // Get the count of active employees
      const activeEmployees = await Employee.countDocuments({ isActive: true });
  
      // Get the count of verified employees
      const verifiedEmployees = await Employee.countDocuments({ isVerified: true });
  
      // Get the count of managers
      const totalManagers = await Manager.countDocuments();
  
      // Get the count of active managers
      const activeManagers = await Manager.countDocuments({ isActive: true });
  
      // Get the count of verified managers
      const verifiedManagers = await Manager.countDocuments({ isVerified: true });
  
      // Get the total company employees count (sum of total employees and total managers)
      const totalCompanyEmployees = totalEmployees + totalManagers;
  
      // Get the count of employees who joined in the last month
      const lastMonthEmployees = await Employee.countDocuments({
        "professionalDetails.joiningDate": {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      });
  
      // Get the count of employees who joined in each month over the past 6 months
      const employeeMonthsJoined = await Employee.aggregate([
        {
          $match: {
            "professionalDetails.joiningDate": {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)), // Last 6 months
            },
          },
        },
        {
          $group: {
            _id: { $month: "$professionalDetails.joiningDate" }, // Group by month of joining
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 }, // Sort by month in ascending order
        },
      ]);
  
      // Get the count of managers who joined in each month over the past 6 months
      const managerMonthsJoined = await Manager.aggregate([
        {
          $match: {
            "professionalDetails.joiningDate": {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)), // Last 6 months
            },
          },
        },
        {
          $group: {
            _id: { $month: "$professionalDetails.joiningDate" }, // Group by month of joining
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 }, // Sort by month in ascending order
        },
      ]);
  
      // Month names array
      const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
      ];
  
      // Initialize an empty object for the months and counts for employees and managers
      const employeeMonthCounts: { [key: string]: number } = {};
      const managerMonthCounts: { [key: string]: number } = {};
  
      const currentMonth = new Date().getMonth(); // Get the current month (0-based index)
  
      // Initialize all months with 0 count for employees and managers in their respective objects
      for (let i = 0; i < 6; i++) {
        const monthIndex = (currentMonth - i + 12) % 12;
        employeeMonthCounts[monthNames[monthIndex]] = 0; // Set default count for employees for each month
        managerMonthCounts[monthNames[monthIndex]] = 0;  // Set default count for managers for each month
      }
  
      // Map the aggregated employee data into the employeeMonthCounts object
      employeeMonthsJoined.forEach((entry: any) => {
        const monthIndex = (currentMonth - entry._id + 12) % 12; // Adjust for past months
        const monthName = monthNames[entry._id - 1]; // Get the month name (1-based index)
        employeeMonthCounts[monthName] = entry.count;
      });
  
      // Map the aggregated manager data into the managerMonthCounts object
      managerMonthsJoined.forEach((entry: any) => {
        const monthIndex = (currentMonth - entry._id + 12) % 12; // Adjust for past months
        const monthName = monthNames[entry._id - 1]; // Get the month name (1-based index)
        managerMonthCounts[monthName] = entry.count;
      });
  
      // Return the collected data for the dashboard
      return {
        totalEmployees,
        activeEmployees,
        verifiedEmployees,
        totalManagers,
        activeManagers,
        verifiedManagers,
        totalCompanyEmployees, // New total company employees count
        lastMonthEmployees,
        employeeMonthCounts, // Object of month names and their corresponding employee join counts
        managerMonthCounts,  // Object of month names and their corresponding manager join counts
      };
    } catch (error) {
      console.error("Error retrieving dashboard data: ", error);
      throw new Error("Failed to fetch dashboard data.");
    }
  }

  async addServiceRequest(businessOwnerId: string, businessOwnerData: any, data: any): Promise<any> {
    try {

      const { companyName, companyLogo } = businessOwnerData.companyDetails;  
      const { serviceName, requestReason } = data;  
  
      const newServiceRequest = new serviceRequestModel({
        businessOwnerId,  
        companyName,      
        companyLogo,      
        serviceName,   
        requestReason,  
        status: 'Pending', 
      });
  
      // Save the service request to the database
      const result = await newServiceRequest.save();
  
      // Return the saved result
      return result;
    } catch (error) {
      console.error("Error adding service request: ", error);
      throw new Error("Failed to add service request.");
    }
  }

  async getAllServiceRequests(businessOwnerId: string): Promise<any[]> {
    try {
      const result = await serviceRequestModel.find({ businessOwnerId: businessOwnerId }).exec();
      return result;
    } catch (error) {
      console.error("Error getting service requests: ", error);
      throw new Error("Failed to get service requests.");
    }
  
  }

  async updateServiceRequest(serviceRequestId: string, data: any): Promise<any> {
    try {
      const result = await serviceRequestModel.findOneAndUpdate(
        { _id: serviceRequestId },
        { $set: data },
        { new: true }
      );
      return result;
    } catch (error) {
      console.error("Error updating service request: ", error);
      throw new Error("Failed to update service request.");
    }
  }

  async updateLastSeenForChats(businessOwnerId: string): Promise<any> {
    console.log(`update laste seen for ${businessOwnerId}`);
    
    try {
      const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
      const chat = _switchDb.model('Chats', chatModel.schema);


        const result = await chat.updateMany(
            {
                chatType: "private",
                groupAdmin: { $ne: businessOwnerId }, // groupAdminId !== businessOwnerId
                participants: businessOwnerId // businessOwnerId exists in participants
            },
            {
                $set: { lastSeen: new Date() }
            }
        );

        return {
            success: true,
            message: "Last seen updated successfully!",
            data: result
        };
    } catch (error: any) {
        throw new Error(error.message || "Error while updating last seen");
    }
  }

  // async updateIsActive(businessOwnerId: string , isActive: boolean): Promise<any> {
  //   console.log(`update isActive for ${businessOwnerId}`.bgWhite + " " + isActive);
    
  //   try {
  //     const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
  //     console.log(`111111111111111111111111111`.bgWhite.bold,_switchDb);
      
  //     const businessOwner = _switchDb.model('businessOwners', businessOwnerModel.schema)
  //     console.log(`2222222222222222222222222`.bgWhite.bold,businessOwner);
  //    ;
  //     const result = await businessOwner.findOneAndUpdate(
  //       { _id: businessOwnerId },
  //       { $set: { isActive: isActive } },
  //       { new: true }
  //     );
  //     console.log(`33333333333333333333333333`.bgWhite.bold ,result);
  //     // console.log(`444444444444444444444`.bgWhite.bold)
  //     return result;
  //   } catch (error) {
  //     console.error("Error updating service request: ", error);
  //     throw new Error("Failed to update service request.");
  //   }
  // }
  async updateIsActive(businessOwnerId: string, isActive: boolean): Promise<any> {
    console.log(`Updating isActive for ${businessOwnerId}`.bgWhite, isActive);

    try {
        const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
        console.log(`Switching to DB`.bgWhite.bold);

        const businessOwnerCollection = _switchDb.collection('businessOwners');
        console.log(`Business Owner Collection:`.bgWhite.bold, businessOwnerCollection);

        const first = await businessOwnerCollection.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(businessOwnerId) }, 
            { $set: { isActive } }, 
            { upsert: true, returnDocument: "after" } // ✅ Fixed option
        );
        console.log(`Updated in businessOwners collection:`.bgRed.bold, first);

        const result = await this._businessOwnerModel.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(businessOwnerId) }, 
            { $set: { isActive } }, 
            { returnDocument: "after" } // ✅ Fixed option
        );
        console.log(`Updated in _businessOwnerModel:`.bgWhite.bold, result);

        return result;
    } catch (error) {
        console.error("Error updating isActive: ", error);
        throw new Error("Failed to update isActive.");
    }
}
  
}
