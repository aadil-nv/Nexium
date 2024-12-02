import {inject ,injectable } from "inversify";
import { Request, Response } from "express";
import IOnboardingService from "../interface/IOnboardingService";
import IOnboardingRepository from "../../repository/interface/IOnboardingRepository";

@injectable()
export default  class OnboardingService implements IOnboardingService {
    constructor(
        @inject("IOnboardingRepository") private _onboardingRepository: IOnboardingRepository
    ) {}

    async addOnboardingEmployee(employeeData: any, managerId: string): Promise<any> {
        console.log('"hitting addOnboardingEmployee service=------------------"'.bgRed);
        console.log("employeeData", employeeData);
        console.log("managerId", managerId);
        
        
        try {
            // Validate required fields
            const requiredFields = ['employeeName', 'email', 'phone'];
            for (const field of requiredFields) {
                if (!employeeData[field]) {
                    return {
                        success: false,
                        message: `Missing required field: ${field}`,
                    };
                }
            }
    
            // Check if email already exists
            const existingEmployee = await this._onboardingRepository.getEmployeeByEmail(employeeData.email);
            if (existingEmployee) {
                return {
                    success: false,
                    message: "An employee with this email already exists.",
                };
            }
    
            // Prepare the new employee data with defaults
            const newEmployeeData = {
                personalDetails: {
                    employeeName: employeeData.employeeName,
                    email: employeeData.email,
                    phone: employeeData.phone,
                },
                professionalDetails: {
                    position: "onboarding", // Default position
                    workTime: employeeData.workTime || "Full-Time", // Default to Full-Time if not provided
                    department: employeeData.department || "General", // Default department
                },
                managerId: managerId,
            };
    
            // Add the new employee
            const newEmployee = await this._onboardingRepository.addOnboardingEmployee(newEmployeeData , managerId);
            return {
                success: true,
                message: "Employee added successfully to onboarding.",
                data: newEmployee,
            };
        } catch (error :any ) {
            console.error("Error adding onboarding employee:", error);
            return {
                success: false,
                message: "An error occurred while adding the onboarding employee.",
                error: error.message,
            };
        }
    }
    
}