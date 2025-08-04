import { injectable, inject } from "inversify";
import { Model } from "mongoose";
import BaseRepository from "./baseRepository";
import IEmployee from "../../entities/employeeEntities";
import IEmployeeRepository from "../../repository/interface/IEmployeeRepository";
import managerModel from "../../models/managerModel";
import connectDB from "../../config/connectDB";
import { IManager } from "../../entities/managerEntities";
import { IBusinessOwnerDocument } from "entities/businessOwnerEntities";
import businessOwnerModel from "../../models/businessOwnerModel";

@injectable()
export default class EmployeeRepository extends BaseRepository<IEmployee> implements IEmployeeRepository {
  constructor(@inject("IEmployee") private readonly _employeeModel: Model<IEmployee>) {
    super(_employeeModel);
  }

  async getProfile(employeeId: string ,businessOwnerId: string): Promise<IEmployee> {
    try {
      const switchDB = await connectDB(businessOwnerId);
      const employee = await switchDB.model<IEmployee>("Employee", this._employeeModel.schema)
        .findOne({ _id: employeeId }) 
        .select({ password: 0 })
        .exec();

      if (!employee) {
        throw new Error("Employee not found");
      }

      return employee;
    } catch (error: any) {
      throw new Error("Error fetching employee profile: " + error.message);
    }
  }

  async updateIsActive(employeeId: string, isActive: boolean ,businessOwnerId: string): Promise<IEmployee> {
    try {
      const switchDB = await connectDB( businessOwnerId);
      const updatedEmployee = await switchDB.model<IEmployee>("Employee", this._employeeModel.schema).findByIdAndUpdate(
        employeeId,
        { $set: { isActive } },
        { new: true }
      );
      if (!updatedEmployee) {
        throw new Error("Employee not found");
      }
      return updatedEmployee;
    } catch (error: any) {
      throw new Error("Error updating employee status: " + error.message);
    }
  }


  async findBusinessOwnerId(managerId: string ,businessOwnerId: string): Promise<string> {
    try {
      const switchDB = await connectDB(businessOwnerId);
        const manager = await switchDB.model<IManager>("Manager", managerModel.schema)
            .findOne({ _id: managerId })
            .select({ businessOwnerId: 1 })
            .exec();
            console.log(`manager from repository`,manager);
            
        if (!manager || !manager.businessOwnerId) {
            throw new Error("Business owner ID not found for the given manager.");
        }

        return manager.businessOwnerId.toString(); 
    } catch (error: any) {
        throw new Error("Error fetching business owner ID: " + error.message);
    }
}

async updateProfile(employeeId: string, data: any,businessOwnerId: string): Promise<IEmployee> {
  try {
      const { profilePicture, ...updateData } = data;
      const switchDB = await connectDB(businessOwnerId);
      const employee = await switchDB.model<IEmployee>("Employee", this._employeeModel.schema).findByIdAndUpdate(
        employeeId,
        { $set: { 
            "personalDetails.businessOwnerName": data.employeeName,
            "personalDetails.email": data.email,
            "personalDetails.personalWebsite": data.personalWebsite,
            "personalDetails.phone": data.phone,
            "personalDetails.bankAccountNumber": data.bankAccountNumber,
            "personalDetails.ifscCode": data.ifscCode,
            "personalDetails.panNumber": data.panNumber,
            "personalDetails.aadharNumber": data.aadharNumber,
            "personalDetails.gender": data.gender,
          } },
        { new: true } // Return the updated document
      );
  

      if (!employee) {
          throw new Error("Employee not found");
      }

      return employee;
  } catch (error: any) {
      throw new Error("Error updating employee profile: " + error.message);
  }
}


async  updateProfilePicture(employeeId: string, file: string,businessOwnerId: string): Promise<IEmployee>{

    
    try {
      const switchDB = await connectDB(businessOwnerId);
      const result = await switchDB.model<IEmployee>("Employee", this._employeeModel.schema).findByIdAndUpdate(
        employeeId,
        { $set: { 'personalDetails.profilePicture': file } },
        { new: true }
      );
  
      if (!result) {
        throw new Error(`No business owner found with ID: ${employeeId}`);
      }
  
      return result;
    } catch (error) {
      console.error('Error updating personal details:', error);
      throw new Error('Could not update personal details.');
    }
  }
  

async updateAddress(employeeId: string, data: any,businessOwnerId: string): Promise<IEmployee> {
  try {
    const switchDB = await connectDB(businessOwnerId);

      const result = await switchDB.model<IEmployee>("Employee", this._employeeModel.schema).findByIdAndUpdate(
        employeeId,
        { $set: { 'address': data } }, 
        { new: true }
      );
  
      if (!result) {
        throw new Error(`No business owner found with ID: ${employeeId}`);
      }
  
      return result;
    } catch (error) {
      console.error('Error updating personal details:', error);
      throw new Error('Could not update personal details.');
    }
  }

  async uploadDocuments(employeeId: string, fileType: "resume", documentData: any,businessOwnerId: string): Promise<IEmployee> {
    try {
      const switchDB = await connectDB(businessOwnerId);

      const result = await switchDB.model<IEmployee>("Employee", this._employeeModel.schema).findByIdAndUpdate(
        employeeId,
        { $set: { [`documents.${fileType}`]: documentData } },
        { new: true }
      );
  
      if (!result) {
        throw new Error(`No business owner found with ID: ${employeeId}`);
      }
  
      return result;
    } catch (error) {
      console.error('Error updating personal details:', error);
      throw new Error('Could not update personal details.');
    }
  }

  async getEmployeeDashboardData(employeeId: string,businessOwnerId: string): Promise<any> {
    try {
      const switchDB = await connectDB(businessOwnerId);

        const employee = await switchDB.model<IEmployee>("Employee", this._employeeModel.schema).findOne({ _id: employeeId });
        if (!employee) {
            throw new Error(`No employee records found for employee ID ${employeeId}`);
        }
        return employee;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async findEmployeeIsBlocked(employeeId: string,businessOwnerId: string): Promise<boolean> {
  try {
    const switchDB = await connectDB(businessOwnerId);
    const employee = await switchDB.model<IEmployee>("Employee", this._employeeModel.schema).findOne({ _id: employeeId });
    if (!employee) {
        throw new Error(`No employee records found for employee ID ${employeeId}`);
    }
    return employee.isBlocked;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async findBusinessOwnerIsBlocked(employeeId: string, businessOwnerId: string): Promise<boolean> {
  try {
    const db = await connectDB(businessOwnerId);
          const businessOwner = await db
            .model<IBusinessOwnerDocument>("businessowners", businessOwnerModel.schema)
            .findById(businessOwnerId)
      
          if (!businessOwner ) {
            throw new Error(`No BusinessOwner records found for employee ID ${employeeId}`);
          }
      
          return businessOwner.isBlocked ?? null; 
  } catch (error) {
    console.error(error);
    throw error;
  }
}

}