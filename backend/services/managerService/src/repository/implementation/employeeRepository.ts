import IEmployeeRepository from "../interface/IEmployeeRepository";
import { inject, injectable } from "inversify";
import IEmployee from "../../entities/employeeEntities";
import { Model } from "mongoose";
import BaseRepository from "./baseRepository";
import departmentModal from "../../models/departmentModel";
import IDepartment from "../../entities/departmentEntities";
import employeeLeaveModel from "../../models/employeeLeaveModel";
import leaveTypeModel from "../../models/leaveTypeModel";
import { ILeaveType } from "../../entities/leaveTypeEntities";
import {IEmployeeLeave} from "../../entities/employeeLeaveEntities";


@injectable()
export default class EmployeeRepository extends BaseRepository<IEmployee> implements IEmployeeRepository {
    private readonly employeeModel: Model<IEmployee>;
    private readonly departmentModel: Model<IDepartment>;
    private readonly employeeLeaveModel: Model<IEmployeeLeave>;
    private  readonly leaveTypeModel: Model<ILeaveType>;

    constructor(@inject("EmployeeModel") _employeeModel: Model<IEmployee>) {
        super(_employeeModel);
        this.employeeModel = _employeeModel;
        this.departmentModel = departmentModal
        this.employeeLeaveModel = employeeLeaveModel
        this.leaveTypeModel = leaveTypeModel
    }

    async getEmployees(): Promise<IEmployee[]> {
        try {
            const employees = await this.employeeModel.find();
            return employees;
        } catch (error) {
            console.error("Error finding employees:", error);
            return []; // Return an empty array in case of an error
        }
    }
    

    async addEmployee(employeeData: IEmployee): Promise<IEmployee> {
        try {
            // Create a new employee from the employeeData
            const employee = new this.employeeModel(employeeData);
            console.log("Employee from repo -----------------", employee);
    
            // Save the employee to the database
            const savedEmployee = await employee.save();
    
            // Find the existing leave types
            const existingLeaves = await this.leaveTypeModel.findOne();
            if (!existingLeaves) {
                throw new Error("Leave type not found");
            }
    
            // Create a new leave entry for the employee
            const employeeLeaveData = {
                employeeId: savedEmployee._id,  // Link the leave record to the saved employee
                sickLeave: existingLeaves.sickLeave,
                casualLeave: existingLeaves.casualLeave,
                maternityLeave: existingLeaves.maternityLeave,
                paternityLeave: existingLeaves.paternityLeave,
                paidLeave: existingLeaves.paidLeave,
                unpaidLeave: existingLeaves.unpaidLeave,
                compensatoryLeave: existingLeaves.compensatoryLeave,
                bereavementLeave: existingLeaves.bereavementLeave,
                marriageLeave: existingLeaves.marriageLeave,
                studyLeave: existingLeaves.studyLeave,
            };
    
            // Save the employee's leave data
            const employeeLeave = new this.employeeLeaveModel(employeeLeaveData);
            await employeeLeave.save();
    
            // Return the saved employee
            return savedEmployee;
    
        } catch (error) {
            console.error("Error in addEmployee repository:", error);
            throw new Error("Failed to add employee to the database");
        }
    }
    

    async findByEmail(email: string): Promise<IEmployee | null> {
        try {
            return await this.employeeModel.findOne({ "personalDetails.email": email });
        } catch (error) {
            console.error("Error finding employee by email:", error);
            return null;
        }
    }

    async getEmployeeInformation(employeeId: string): Promise<IEmployee> {
        try {
            const employee = await this.employeeModel.findById(employeeId);
            if (!employee) {
                throw new Error("Employee not found");
            }
            return employee;
        } catch (error) {
            console.error("Error finding employee by ID:", error);
            throw new Error("Failed to fetch employee information");
        }
    }

    async updateEmployeePersonalInformation(employeeId: string, personalInformation: any): Promise<IEmployee> {
        console.log("personalInformation", personalInformation);
        try {
            // Find the employee by ID
            const employee = await this.employeeModel.findById(employeeId);
            if (!employee) {
                throw new Error("Employee not found");
            }
    
            // Update the personal details
            employee.personalDetails = { 
                ...employee.personalDetails, 
                ...personalInformation 
            };
    
            // Save the updated employee document
            const updatedEmployee = await employee.save();
    
            console.log("updatedEmployee", updatedEmployee);
    
            return updatedEmployee;
        } catch (error) {
            console.error("Error updating employee information:", error);
            throw new Error("Failed to update employee personal information");
        }
    }

    async updateAddress(employeeId: string, address: IEmployee['address']): Promise<IEmployee> {

        console.log("address from repo ", address);
        
        try {
            // Find the employee by ID and update the address in a single step
            const updatedEmployee = await this.employeeModel.findByIdAndUpdate(
                employeeId,
                { address }, // Directly update the address field
                { new: true, runValidators: true } // Return the updated document and run schema validations
            );

            console.log("updatedEmployee from repo ------------", updatedEmployee);
            
    
            if (!updatedEmployee) {
                throw new Error("Employee not found");
            }
    
            return updatedEmployee;
        } catch (error) {
            console.error("Error updating employee address:", error);
            throw new Error("Failed to update employee address");
        }
    }

    async updateEmployeeProfessionalInfo(employeeId: string, professionalInfo: any): Promise<IEmployee> {
        try {
            // Find the employee by ID
            const employee = await this.employeeModel.findById(employeeId);
            if (!employee) {
                throw new Error("Employee not found");
            }
    
            // Update the professional details
            employee.professionalDetails = {
                ...employee.professionalDetails,
                ...professionalInfo
            };
    
            // Save the updated employee document
            const updatedEmployee = await employee.save();
    
            return updatedEmployee;
        } catch (error) {
            console.error("Error updating employee professional information:", error);
            throw new Error("Failed to update employee professional information");
        }
    }
    
    async getDepartmentName(departmentId: string): Promise<any> {
        try {
            const department = await this.departmentModel.findById(departmentId);
            if (!department) {
               return null;
            }
            return department.departmentName;
        } catch (error) {
            console.error("Error finding department by ID:", error);
            throw new Error("Failed to fetch department name");
        }
    }

    async updateProfilePicture(employeeId: string ,profilePicture: any): Promise<any> {
        try {
            const employee = await this.employeeModel.findById(employeeId);
            if (!employee) {
                throw new Error("Employee not found");
            }
            employee.personalDetails.profilePicture = profilePicture;
            const updatedEmployee = await employee.save();
            console.log(`updatedEmployee((((((((((((((((()))))))))))))))))`.bgRed, updatedEmployee);
            
            return updatedEmployee.personalDetails.profilePicture;
        } catch (error) {
            console.error("Error updating employee profile picture:", error);
            throw new Error("Failed to update employee profile picture");
        }
    }

    async updateResume(employeeId: string, documentMetadata: any): Promise<any> {
        try {
            const employee = await this.employeeModel.findById(employeeId);
            if (!employee) {
                throw new Error("Employee not found");
            }
    
            // Update the resume details in the `documents` section
            employee.documents.resume = {
                ...documentMetadata,
            };
    
            await employee.save();
    
            return employee.documents.resume;
        } catch (error) {
            console.error("Error in updateResume repository:", error);
            throw new Error("Failed to update resume in the database");
        }
    }

 

    async updateBlocking(employeeId: string, blocking: any): Promise<any> {
        console.log("blocking object received:", blocking);
      
        try {
          // Find the employee by ID
          const employee = await this.employeeModel.findById(employeeId);
          if (!employee) {
            throw new Error("Employee not found");
          }
      
          // Toggling the isBlocked value based on current state
          const newBlocking = !employee.isBlocked;
      
          return await this.employeeModel.updateOne(
            { _id: employeeId },
            { $set: { isBlocked: newBlocking } }
          );
      
          // Returning the updated isBlocked value
        } catch (error) {
          console.error("Error in updateBlocking repository:", error);
          throw new Error("Failed to update blocking in the database");
        }
      }
      
      async getEmployeeWithOutDepartment(): Promise<IEmployee[]> {
        try {
          const employees = await this.employeeModel.find({ "professionalDetails.department": null });
          return employees;
        } catch (error) {
          console.error("Error in getEmployeeWithOutDepartment repository:", error);
          throw new Error("Failed to fetch employees without department");
        }
      }

      async removeEmployee(employeeId: string): Promise<any> {
        try {
          const result = await this.employeeModel.findByIdAndDelete(employeeId);
          return result;
        } catch (error) {
          console.error("Error in removeEmployee repository:", error);
          throw new Error("Failed to remove employee");
        }   
      }
    
      async updateCredentials(employeeId: string ,credentials: any): Promise<any> {
        try {
            const employee = await this.employeeModel.findById(employeeId);
            if (!employee) {
                throw new Error("Employee not found");
            }
            employee.employeeCredentials = credentials;
            const updatedEmployee = await employee.save();
            return updatedEmployee.employeeCredentials;
        } catch (error) {
            console.error("Error updating employee credentials:", error);
            throw new Error("Failed to update employee credentials");
        }
    }

    async getAllTeamLeads(): Promise<IEmployee[]> {
        try {
            // Fetch employees with position "Team Lead"
            const employees = await this.employeeModel.find({
                "professionalDetails.position": "Team Lead"
               
            });
    
            return employees;
        } catch (error) {
            console.error("Error in getAllTeamLeads repository:", error);
            throw new Error("Failed to fetch all team leads.");
        }
    }
    
    
    
}
