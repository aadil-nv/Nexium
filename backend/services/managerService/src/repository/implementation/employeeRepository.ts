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
import connectDB from "../../config/connectDB";


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

    async getEmployees(businessOwnerId: string): Promise<IEmployee[]> {
        try {

            const switchDB = await connectDB(businessOwnerId); 

            const employees = await switchDB.model("Employee", this.employeeModel.schema).find();
            return employees;
        } catch (error) {
            console.error("Error finding employees:", error);
            return []; // Return an empty array in case of an error
        }
    }
    
    async addEmployee(employeeData: IEmployee, businessOwnerId: string): Promise<IEmployee> {
        try {
            const db = await connectDB(businessOwnerId);
            const employeeModel = db.model<IEmployee>("Employee", this.employeeModel.schema);
            const savedEmployee = await new employeeModel(employeeData).save();
    
            const leaveTypeModel = db.model<ILeaveType>("LeaveType", this.leaveTypeModel.schema);
            const existingLeaves = await leaveTypeModel.findOne();
            
            if (!existingLeaves) throw new Error("Leave type not found");
    
            const employeeLeaveData = {
                employeeId: savedEmployee._id,
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
    
            const employeeLeaveModel = db.model<IEmployeeLeave>("EmployeeLeave", this.employeeLeaveModel.schema);
            await new employeeLeaveModel(employeeLeaveData).save();
    
            return savedEmployee;
        } catch (error) {
            console.error("Error in addEmployee repository:", error);
            throw new Error("Failed to add employee to the database");
        }
    }
    
    async findByEmail(email: string, businessOwnerId: string): Promise<IEmployee | null> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            return await switchDB.model("Employee", this.employeeModel.schema).findOne({ "personalDetails.email": email });
        } catch (error) {
            console.error(`Error finding employee with email ${email} for business owner ${businessOwnerId}:`, error);
            return null;
        }
    }
    

    async getEmployeeInformation(employeeId: string, businessOwnerId: string): Promise<IEmployee> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            const employee = await switchDB.model<IEmployee>("Employee", this.employeeModel.schema).findById(employeeId);
    
            if (!employee) {
                throw new Error("Employee not found");
            }
    
            return employee;
        } catch (error) {
            console.error("Error finding employee by ID:", error);
            throw new Error("Failed to fetch employee information");
        }
    }
    

    async updateEmployeePersonalInformation(employeeId: string, personalInformation: any, businessOwnerId: string): Promise<IEmployee> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            const employee = await switchDB.model<IEmployee>("Employee", this.employeeModel.schema).findById(employeeId);
    
            if (!employee) {
                throw new Error("Employee not found");
            }
    
            employee.personalDetails = { 
                ...employee.personalDetails, 
                ...personalInformation 
            };
    
            const updatedEmployee = await employee.save();
            return updatedEmployee;
        } catch (error) {
            console.error("Error updating employee information:", error);
            throw new Error("Failed to update employee personal information");
        }
    }
    

    async updateAddress(employeeId: string, address: IEmployee['address'], businessOwnerId: string): Promise<IEmployee> {
        try {
            // Connect to the correct database based on the businessOwnerId
            const switchDB = await connectDB(businessOwnerId);
            
            // Use the dynamic employee model from the correct database context
            const updatedEmployee = await switchDB.model<IEmployee>("Employee", this.employeeModel.schema).findByIdAndUpdate(
                employeeId,
                { address }, // Directly update the address field
                { new: true, runValidators: true } // Return the updated document and run schema validations
            );
    
            if (!updatedEmployee) {
                throw new Error("Employee not found");
            }
    
            return updatedEmployee;
        } catch (error) {
            console.error("Error updating employee address:", error);
            throw new Error("Failed to update employee address");
        }
    }
    

    async updateEmployeeProfessionalInfo(employeeId: string, professionalInfo: any, businessOwnerId: string): Promise<IEmployee> {
        try {
            // Connect to the correct database
            const switchDB = await connectDB(businessOwnerId);
            
            // Get the employee model dynamically from the correct database context
            const employeeModel = switchDB.model<IEmployee>("Employee", this.employeeModel.schema);
    
            // Find the employee
            const employee = await employeeModel.findById(employeeId);
            if (!employee) {
                throw new Error("Employee not found");
            }
    
            // Update the professional details
            employee.professionalDetails = {
                ...employee.professionalDetails,
                ...professionalInfo
            };
    
            // Save and return the updated employee document
            return await employee.save();
        } catch (error) {
            console.error("Error updating employee professional information:", error);
            throw new Error("Failed to update employee professional information");
        }
    }
    
    
    async getDepartmentName(departmentId: string, businessOwnerId: string): Promise<string | null> {
        try {
            // Connect to the correct database
            const db = await connectDB(businessOwnerId);
    
            // Get the department model dynamically from the correct database context
            const departmentModel = db.model<IDepartment>("Department", this.departmentModel.schema);
    
            // Find the department
            const department = await departmentModel.findById(departmentId).select("departmentName");
    
            return department ? department.departmentName : null;
        } catch (error) {
            console.error("Error finding department by ID:", error);
            throw new Error("Failed to fetch department name");
        }
    }
    

    async updateProfilePicture(employeeId: string, profilePicture: any, businessOwnerId: string): Promise<string> {
        try {
            // Connect to the correct database
            const db = await connectDB(businessOwnerId);
    
            // Get the employee model dynamically from the correct database context
            const employeeModel = db.model<IEmployee>("Employee", this.employeeModel.schema);
    
            // Find the employee
            const employee = await employeeModel.findById(employeeId);
            if (!employee) {
                throw new Error("Employee not found");
            }
    
            // Update profile picture
            employee.personalDetails.profilePicture = profilePicture;
            await employee.save();
    
            return employee.personalDetails.profilePicture;
        } catch (error) {
            console.error("Error updating employee profile picture:", error);
            throw new Error("Failed to update employee profile picture");
        }
    }
    
    

    async updateResume(employeeId: string, documentMetadata: any, businessOwnerId: string): Promise<any> {
        try {
            // Connect to the correct database
            const db = await connectDB(businessOwnerId);
    
            // Get the employee model dynamically from the correct database context
            const employeeModel = db.model<IEmployee>("Employee", this.employeeModel.schema);
    
            // Find the employee
            const employee = await employeeModel.findById(employeeId);
            if (!employee) {
                throw new Error("Employee not found");
            }
    
            // Update the resume details in the `documents` section
            employee.documents.resume = documentMetadata;
    
            await employee.save();
    
            return employee.documents.resume;
        } catch (error) {
            console.error("Error updating resume:", error);
            throw new Error("Failed to update resume in the database");
        }
    }
    
    


    async updateBlocking(employeeId: string,blocking: any, businessOwnerId: string): Promise<boolean> {
        console.log("businessOwnerId from updateBlocking ==>",businessOwnerId);
        
        try {
            // Ensure connection to the correct database
            const db = await connectDB(businessOwnerId);
    
            // Get the employee model dynamically from the correct database context
            const employeeModel = db.model<IEmployee>("Employee", this.employeeModel.schema);
    
            // Find the employee
            const employee = await employeeModel.findById(employeeId);
            if (!employee) {
                throw new Error("Employee not found");
            }
    
            // Toggle the isBlocked value
            employee.isBlocked = !employee.isBlocked;
    
            // Save the updated employee document
            await employee.save();
    
            return employee.isBlocked;
        } catch (error) {
            console.error("Error updating employee blocking status:", error);
            throw new Error("Failed to update blocking status in the database");
        }
    }
    
      
    async getEmployeesWithoutDepartment(businessOwnerId: string): Promise<IEmployee[]> {
        try {
            // Ensure connection to the correct database
            const db = await connectDB(businessOwnerId);
    
            // Get the employee model dynamically from the correct database context
            const employeeModel = db.model<IEmployee>("Employee", this.employeeModel.schema);
    
            // Find employees where department is null or not assigned
            const employees = await employeeModel.find({ "professionalDetails.department": { $in: [null, undefined] } });
    
            return employees;
        } catch (error) {
            console.error("Error fetching employees without department:", error);
            throw new Error("Failed to fetch employees without department");
        }
    }
    

    async removeEmployee(employeeId: string, businessOwnerId: string): Promise<IEmployee | null> {
        try {
            // Ensure connection to the correct database
            const db = await connectDB(businessOwnerId);
    
            // Get the employee model dynamically from the correct database context
            const employeeModel = db.model<IEmployee>("Employee", this.employeeModel.schema);
    
            // Delete the employee by ID
            const deletedEmployee = await employeeModel.findByIdAndDelete(employeeId);
    
            return deletedEmployee;
        } catch (error) {
            console.error("Error removing employee:", error);
            throw new Error("Failed to remove employee");
        }
    }
    
    async updateCredentials(employeeId: string, credentials: any, businessOwnerId: string): Promise<any> {
        try {
            // Ensure connection to the correct database
            const db = await connectDB(businessOwnerId);
            
            // Get the employee model dynamically from the correct database context
            const employeeModel = db.model<IEmployee>("Employee", this.employeeModel.schema);
            
            // Find the employee by ID
            const employee = await employeeModel.findById(employeeId);
            
            if (!employee) {
                throw new Error("Employee not found");
            }
            
            // Update employee credentials
            employee.employeeCredentials = credentials;
            
            // Save the updated employee and return the updated credentials
            const updatedEmployee = await employee.save();
            
            return updatedEmployee.employeeCredentials;
        } catch (error) {
            console.error("Error updating employee credentials:", error);
            throw new Error("Failed to update employee credentials");
        }
    }
    

    async getAllTeamLeads(businessOwnerId: string): Promise<IEmployee[]> {
        try {
            const db = await connectDB(businessOwnerId);
            
            const employeeModel = db.model<IEmployee>("Employee", this.employeeModel.schema);
            
            // Find employees with the position of "Team Lead"
            const employees = await employeeModel.find({
                "professionalDetails.position": "Team Lead"
            });
            
            return employees;
        } catch (error) {
            console.error("Error in getAllTeamLeads repository:", error);
            throw new Error("Failed to fetch all team leads.");
        }
    }
    
    
    
    
    
}
