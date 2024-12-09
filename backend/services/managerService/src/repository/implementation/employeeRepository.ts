import IEmployeeRepository from "../interface/IEmployeeRepository";
import { inject, injectable } from "inversify";
import IEmployee from "../../entities/employeeEntities";
import { Model } from "mongoose";
import BaseRepository from "./baseRepository";


@injectable()
export default class EmployeeRepository extends BaseRepository<IEmployee> implements IEmployeeRepository {
    private readonly employeeModel: Model<IEmployee>;

    constructor(@inject("EmployeeModel") _employeeModel: Model<IEmployee>) {
        super(_employeeModel);
        this.employeeModel = _employeeModel;
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
            const employee = new this.employeeModel(employeeData);
            console.log("employee from repo -----------------", employee);
            
            return await employee.save();
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
    
    
}
