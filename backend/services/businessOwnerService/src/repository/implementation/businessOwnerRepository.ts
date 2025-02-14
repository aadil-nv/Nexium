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
import subscriptionModel from "../../models/subscriptionModel";
import ISubscription from "../../entities/subscriptionEntity";
import ILeaveType from "../../entities/leaveTypeEntity";

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

      
      const businessOwner = _switchDb.model('businessowners', BusinessOwnerModel.schema);
       await businessOwner.findByIdAndUpdate(
        businessOwnerId,
        { $set: { 
          "personalDetails.businessOwnerName": updateFields.businessOwnerName,
          "personalDetails.email": updateFields.email,
          "personalDetails.personalWebsite": updateFields.personalWebsite,
          "personalDetails.phone": updateFields.phone
        } }, // Save the file path
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
      const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
      const businessOwner = _switchDb.model('businessowners', businessOwnerModel.schema)
      await businessOwner.findByIdAndUpdate(
        businessOwnerId,
        { $set: { 'personalDetails.profilePicture': filePath } }, // Save the file path
        { new: true }
      );

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
      const businessOwner = _switchDb.model('businessowners', businessOwnerModel.schema)
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
      const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
      const businessOwner = _switchDb.model('businessowners', businessOwnerModel.schema)
      const result = await this._businessOwnerModel.findByIdAndUpdate(
        businessOwnerId,
        { $set: { 'address': data } }, // Save the file path
        { new: true }
      );

       await businessOwner.findByIdAndUpdate(
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
      const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
      const businessOwner = _switchDb.model('businessowners', businessOwnerModel.schema)
      const result = await this._businessOwnerModel.findByIdAndUpdate(
        businessOwnerId,
        { $set: { 
          'companyDetails.companyName': data.companyName,
          'companyDetails.companyRegistrationNumber': data.companyRegistrationNumber,
           'companyDetails.companyWebsite': data.companyWebsite,
           'companyDetails.companyEmail': data.companyEmail } }, // Save the file path
        { new: true }
      );

       await businessOwner.findByIdAndUpdate(
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
      const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
      const businessOwner = _switchDb.model('businessowners', businessOwnerModel.schema)

      if (documentType !== 'companyCertificate') {
        throw new Error(`Invalid document type: ${documentType}`);
      }
  
      const updateData = {
        [`documents.${documentType}`]: documentData
      };
  
      const result = await this._businessOwnerModel.findByIdAndUpdate(
        businessOwnerId,
        updateData,
        { new: true }
      );
      await businessOwner.findByIdAndUpdate(
        businessOwnerId,
        updateData,
        { new: true }
      )
  
      if (!result) throw new Error(`No business owner found with ID: ${businessOwnerId}`);

      return result;
    } catch (error) {
      console.error('Error updating documents:', error);
      throw new Error('Could not update documents.');
    }
  }

  async getDashboardData(companyId: string): Promise<any> {
    try {
      const _switchDb = mongoose.connection.useDb(companyId, { useCache: true });
  
      const Employee = _switchDb.model('Employees', EmployeeModel.schema);
      const Manager = _switchDb.model('Managers', ManagerModel.schema);
  
      const totalEmployees = await Employee.countDocuments();
  
      const activeEmployees = await Employee.countDocuments({ isActive: true });
  
      const verifiedEmployees = await Employee.countDocuments({ isVerified: true });
  
      const totalManagers = await Manager.countDocuments();
  
      const activeManagers = await Manager.countDocuments({ isActive: true });
  
      const verifiedManagers = await Manager.countDocuments({ isVerified: true });
  
      const totalCompanyEmployees = totalEmployees + totalManagers;
  
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
          $sort: { _id: 1 },
        },
      ]);
  
      const managerMonthsJoined = await Manager.aggregate([
        {
          $match: {
            "professionalDetails.joiningDate": {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$professionalDetails.joiningDate" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 }, 
        },
      ]);
  
      // Month names array
      const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
      ];
  
      const employeeMonthCounts: { [key: string]: number } = {};
      const managerMonthCounts: { [key: string]: number } = {};
  
      const currentMonth = new Date().getMonth(); 
  
      for (let i = 0; i < 6; i++) {
        const monthIndex = (currentMonth - i + 12) % 12;
        employeeMonthCounts[monthNames[monthIndex]] = 0; 
        managerMonthCounts[monthNames[monthIndex]] = 0; 
      }
  
 
      employeeMonthsJoined.forEach((entry: any) => {
        const monthIndex = (currentMonth - entry._id + 12) % 12; 
        const monthName = monthNames[entry._id - 1]; 
        employeeMonthCounts[monthName] = entry.count;
      });
 
      managerMonthsJoined.forEach((entry: any) => {
        const monthIndex = (currentMonth - entry._id + 12) % 12; 
        const monthName = monthNames[entry._id - 1]; 
        managerMonthCounts[monthName] = entry.count;
      });

      return {
        totalEmployees,
        activeEmployees,
        verifiedEmployees,
        totalManagers,
        activeManagers,
        verifiedManagers,
        totalCompanyEmployees, 
        lastMonthEmployees,
        employeeMonthCounts, 
        managerMonthCounts,  
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
  
      const result = await newServiceRequest.save();
  
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

  async updateIsActive(businessOwnerId: string, isActive: boolean): Promise<any> {
    try {
      const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
        const businessOwnerCollection = _switchDb.model('businessowners', this._businessOwnerModel.schema);
        const first = await businessOwnerCollection.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(businessOwnerId) }, 
            { $set: { isActive } }, 
            { upsert: true, returnDocument: "after" } // ✅ Fixed option
        );

        const result = await this._businessOwnerModel.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(businessOwnerId) }, 
            { $set: { isActive } }, 
            { returnDocument: "after" } // ✅ Fixed option
        );1

        return result;
    } catch (error) {
        console.error("Error updating isActive: ", error);
        throw new Error("Failed to update isActive.");
    }
}


async findAllLeaveTypes(businessOwnerId: string): Promise<ILeaveType> { 
  try {
    const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
    const switchedLeaveTypeModel = _switchDb.model<ILeaveType>("leavetypes", leaveTypeModel.schema);

    let leaveTypesDoc = await switchedLeaveTypeModel.findOne(); 

    if (!leaveTypesDoc) {

      leaveTypesDoc = await switchedLeaveTypeModel.create({
        sickLeave: 0,      
        casualLeave: 0,     
        maternityLeave: 0,
        paternityLeave: 0,   
        paidLeave: 0,    
        unpaidLeave: 0,   
        compensatoryLeave: 0,
        bereavementLeave: 0,  
        marriageLeave: 0,  
        studyLeave: 0,        
      });
      const normalDoc =await leaveTypeModel.create({
        sickLeave: 0,      
        casualLeave: 0,     
        maternityLeave: 0,
        paternityLeave: 0,   
        paidLeave: 0,    
        unpaidLeave: 0,   
        compensatoryLeave: 0,
        bereavementLeave: 0,  
        marriageLeave: 0,  
        studyLeave: 0,
      })

    }

    console.log("leaveTypesDoc", leaveTypesDoc);
    

    return leaveTypesDoc;
  } catch (error) {
    console.error("Error in findAllLeaveTypes repository:", error);
    throw new Error("Failed to fetch leave types");
  }
}


async updateLeaveTypes(leaveTypeId: string, data: Partial<ILeaveType> , businessOwnerId: string): Promise<ILeaveType> {
  try {
    const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });

      const leaveTypesDoc = await _switchDb.model<ILeaveType>("leavetypes", leaveTypeModel.schema).findOne(); 

      if (!leaveTypesDoc) {
          throw new Error('Leave types document not found');
      }

      // Update the corresponding leave type field with new data
      if (data.sickLeave !== undefined) leaveTypesDoc.sickLeave = data.sickLeave;
      if (data.casualLeave !== undefined) leaveTypesDoc.casualLeave = data.casualLeave;
      if (data.maternityLeave !== undefined) leaveTypesDoc.maternityLeave = data.maternityLeave;
      if (data.paternityLeave !== undefined) leaveTypesDoc.paternityLeave = data.paternityLeave;
      if (data.paidLeave !== undefined) leaveTypesDoc.paidLeave = data.paidLeave;
      if (data.unpaidLeave !== undefined) leaveTypesDoc.unpaidLeave = data.unpaidLeave;
      if (data.compensatoryLeave !== undefined) leaveTypesDoc.compensatoryLeave = data.compensatoryLeave;
      if (data.bereavementLeave !== undefined) leaveTypesDoc.bereavementLeave = data.bereavementLeave;
      if (data.marriageLeave !== undefined) leaveTypesDoc.marriageLeave = data.marriageLeave;
      if (data.studyLeave !== undefined) leaveTypesDoc.studyLeave = data.studyLeave;

      // Save the updated document
      const updatedResult = await leaveTypesDoc.save();

      // Return the updated leave type document
      return updatedResult;
  } catch (error: any) {
      console.error("Error in updateLeaveTypes repository:", error);
      throw new Error("Failed to update leave types");
  }
}


  
}
