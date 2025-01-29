import { injectable, inject } from "inversify";
import employeeModel from "../../model/employeeModel";
import IEmployeeRepository from "../interfaces/IEmployeeRepository";
import  IEmployeeDocument  from "../../entities/employeeEntities";
import BaseRepository from "./baseRepository";
import OtpModel from "../../model/otpModel";



@injectable()
export default class EmployeeRepository extends BaseRepository<IEmployeeDocument> implements IEmployeeRepository {
    constructor(@inject("employeeModel") private _employeeModel: any) {
        super(_employeeModel);
    }

    async findByCredentialEmail(email: string): Promise<IEmployeeDocument> {
        try {
          const employee = await this._employeeModel.findOne({ 'employeeCredentials.companyEmail': email });
          
    
          return employee; // Return the employee data
        } catch (error) {
          console.error("Error finding employee by email:", error);
          throw new Error("Failed to find employee by email");
        }
      }


      async findOtpByEmail(email: string): Promise<any | null> {
        return OtpModel.findOne({ email }).exec();
      }

      async updateVerificationStatus(email: string): Promise<any> {
        try {
            return await this._employeeModel.updateOne({"personalDetails.email": email }, { isVerified: true }).exec();
        } catch (error) {
            console.error("Error updating verification status:", error);
            throw new Error("Failed to update verification status");
        }
    }
    
    async findByEmail(email: string): Promise<IEmployeeDocument | null> {

        
        try {
          const employee = await this._employeeModel.findOne({ "personalDetails.email": email  }).exec();
          return employee;
        } catch (error:any) {
          // Log the error for debugging purposes
          console.error("Error finding employee by email:", error.message);
          throw new Error("Failed to find employee by email");
        }
      }

      async updateOtp(email: string, otp: string): Promise<void> {
        const result = await OtpModel.updateOne(
          { email },
          { otp, createdAt: new Date(), updatedAt: new Date() }
        );
    
        if (result.modifiedCount === 0) {
          throw new Error('Failed to update OTP. No document found or OTP was not changed.');
        }
      } 


      async updateEmployee(employee: any): Promise<any> {
        try {
            const employeeId = employee.employeeId;
            
            // Ensure `isVerified` is not updated
            const { isVerified, ...updateData } = employee;
    
            return this._employeeModel.updateOne({ _id: employeeId }, { $set: updateData });
        } catch (error) {
            console.error('Error in updateEmployee service:', error);
            throw error;
        }
    }
    
      

}