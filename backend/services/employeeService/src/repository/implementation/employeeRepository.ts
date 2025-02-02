import { injectable, inject } from "inversify";
import { Model } from "mongoose";
import BaseRepository from "./baseRepository";
import IEmployee from "../../entities/employeeEntities";
import IEmployeeRepository from "../../repository/interface/IEmployeeRepository";
import {IManager} from "../../entities/managerEntities";
import managerModel from "../../models/managerModel";

@injectable()
export default class EmployeeRepository extends BaseRepository<IEmployee> implements IEmployeeRepository {
  constructor(@inject("IEmployee") private readonly _employeeModel: Model<IEmployee>) {
    super(_employeeModel);
  }

  async getProfile(employeeId: string): Promise<IEmployee> {
    try {
      const employee = await this._employeeModel
        .findOne({ _id: employeeId }) // Adjusted to use `_id` if that's the field
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

  async updateIsActive(employeeId: string, isActive: boolean): Promise<IEmployee> {
    try {
      const updatedEmployee = await this._employeeModel.findByIdAndUpdate(
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


  async findBusinessOwnerId(managerId: string): Promise<string> {
    try {
        const manager = await managerModel
            .findOne({ _id: managerId })
            .select({ businessOwnerId: 1 })
            .exec();
            console.log(`manager from repository`,manager);
            
        if (!manager || !manager.businessOwnerId) {
            throw new Error("Business owner ID not found for the given manager.");
        }

        return manager.businessOwnerId.toString(); // Return the businessOwnerId as a string
    } catch (error: any) {
        throw new Error("Error fetching business owner ID: " + error.message);
    }
}

async updateProfile(employeeId: string, data: any): Promise<IEmployee> {
  try {
      const { profilePicture, ...updateData } = data;

      const employee = await this._employeeModel.findByIdAndUpdate(
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


async  updateProfilePicture(employeeId: string, file: string): Promise<IEmployee>{

    
    try {
      const result = await this._employeeModel.findByIdAndUpdate(
        employeeId,
        { $set: { 'personalDetails.profilePicture': file } }, // Save the file path
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
  

async updateAddress(employeeId: string, data: any): Promise<IEmployee> {
  try {
      const result = await this._employeeModel.findByIdAndUpdate(
        employeeId,
        { $set: { 'address': data } }, // Save the file path
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

  async uploadDocuments(employeeId: string, fileType: "resume", documentData: any): Promise<IEmployee> {
    try {
      const result = await this._employeeModel.findByIdAndUpdate(
        employeeId,
        { $set: { [`documents.${fileType}`]: documentData } }, // Save the file path
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

  async getEmployeeDashboardData(employeeId: string): Promise<any> {
    try {
        const employee = await this._employeeModel.findOne({ _id: employeeId });
        if (!employee) {
            throw new Error(`No employee records found for employee ID ${employeeId}`);
        }
        return employee;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

}