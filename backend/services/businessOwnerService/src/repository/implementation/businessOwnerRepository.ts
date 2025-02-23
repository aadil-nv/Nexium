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
import { ILeaveType } from "../../entities/leaveTypeEntities";
import leaveTypeModel from "../../models/leaveTypeModel";
import { IPayrollCriteria } from "../../entities/payrollCriteriaEntities";
import payrollCriteriaModel from "../../models/payrollCriteriaModel";

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
      const businessOwner = _switchDb.model('businessowners', this._businessOwnerModel.schema)
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
      const businessOwner = _switchDb.model('businessowners', this._businessOwnerModel.schema)

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
  
      const Employee = _switchDb.model('employees', EmployeeModel.schema);
      const Manager = _switchDb.model('managers', ManagerModel.schema);
  
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


async findAllLeaveTypes(businessOwnerId: string): Promise<ILeaveType | null> {
  console.log("businessOwnerId from leave types", businessOwnerId);

  try {
    if (!mongoose.Types.ObjectId.isValid(businessOwnerId)) {
      throw new Error("Invalid business owner ID");
    }

    const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
    let switchedLeaveTypeModel: mongoose.Model<ILeaveType>;

    if (!_switchDb.models["LeaveTypes"]) {
      switchedLeaveTypeModel = _switchDb.model<ILeaveType>("LeaveTypes", leaveTypeModel.schema);
      console.log("LeaveTypes collection created!");
    } else {
      switchedLeaveTypeModel = _switchDb.models["LeaveTypes"] as mongoose.Model<ILeaveType>;
    }

    // Convert businessOwnerId to ObjectId
    const ownerId = new mongoose.Types.ObjectId(businessOwnerId);

    let leaveTypesDoc = await switchedLeaveTypeModel.findOne().exec();

    if (!leaveTypesDoc) {
      leaveTypesDoc = await switchedLeaveTypeModel.create({
        businessOwnerId: ownerId, // Ensure correct type
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
      console.log("New leaveTypes collection created and document inserted.");
    }

    console.log("leaveTypesDoc", leaveTypesDoc);
    return leaveTypesDoc;
  } catch (error: any) {
    console.error("Error in findAllLeaveTypes repository:", error.message);
    return null; // Return null instead of throwing an error
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



async getAllPayrollCriteria(businessOwnerId: string): Promise<IPayrollCriteria[]> {
  try {
    // Validate businessOwnerId
    if (!mongoose.Types.ObjectId.isValid(businessOwnerId)) {
      throw new Error("Invalid business owner ID");
    }

    // Switch to the correct business owner's DB
    const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });

    // Check if the model already exists in the database context
    let PayrollCriteriaModel = _switchDb.models["payrollcriterias"];

    if (!PayrollCriteriaModel) {
      // If the model doesn't exist, create it
      PayrollCriteriaModel = _switchDb.model<IPayrollCriteria>("payrollcriterias", payrollCriteriaModel.schema);
      console.log("PayrollCriteria collection created!");
    }

    // Convert businessOwnerId to ObjectId
    const ownerId = new mongoose.Types.ObjectId(businessOwnerId);

    // Fetch the payroll criteria or create it if not found
    let payrollCriteria = await PayrollCriteriaModel.findOne().exec();

    if (!payrollCriteria) {
      // If not found, create the payroll criteria
      payrollCriteria = await PayrollCriteriaModel.create({
        businessOwnerId: ownerId, // Ensure correct type
        allowances: {
          bonus: 0,
          gratuity: 5,
          medicalAllowance: 5,
          hra: 5,
          da: 5,
          ta: 5,
          overTime: {
            type: 0,
            overtimeEnabled: false,
          },
        },
        deductions: {
          incomeTax: 5,
          providentFund: 5,
          professionalTax: 5,
          esiFund: 5,
        },
        incentives: [],
        payDay: 5,
        createdAt: new Date(),
      });
      console.log("New payroll criteria document inserted.");
    }

    return [payrollCriteria]; // Returning as an array
  } catch (error: any) {
    console.error("Error fetching or creating payroll criteria:", error.message);
    throw new Error("Failed to fetch or create payroll criteria");
  }
}



async updatePayrollCriteria(payrollData: any, payrollId: string, businessOwnerId: string): Promise<IPayrollCriteria> {
  try {
    const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });

      // Correct model usage to access the payrollCriteria collection
      const updatedPayroll = await _switchDb.model<IPayrollCriteria>("PayrollCriteria",payrollCriteriaModel.schema)
          .findByIdAndUpdate(payrollId, payrollData, { new: true })
          .exec();

      if (!updatedPayroll) {
          throw new Error("Payroll criteria not found");
      }

      return updatedPayroll;
  } catch (error) {
      console.error("Error updating payroll criteria:", error);
      throw new Error("Failed to update payroll criteria");
  }
}

async deleteIncentive(incentiveId: string, payrollCriteriaId: string, businessOwnerId: string): Promise<IPayrollCriteria> {
  try {
    const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });

      const updatedPayroll = await _switchDb.model<IPayrollCriteria>("PayrollCriteria", payrollCriteriaModel.schema)
          .findByIdAndUpdate(
              payrollCriteriaId, 
              { $pull: { incentives: { _id: incentiveId } } }, 
              { new: true } 
          )
          .exec();

      if (!updatedPayroll) {
          throw new Error("Payroll criteria not found");
      }

      return updatedPayroll;
  } catch (error) {
      console.error("Error deleting incentive:", error);
      throw new Error("Failed to delete incentive");
  }
}
  
}
