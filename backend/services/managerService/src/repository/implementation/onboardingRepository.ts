import { inject, injectable } from "inversify";
import IOnboardingRepository from "../interface/IOnboardingRepository";
import { Model } from "mongoose";
import IEmployee from "../../entities/employeeEntities";
import BaseRepository from "./baseRepository";

@injectable()
export default class OnboardingRepository extends BaseRepository<IEmployee> implements IOnboardingRepository {
    constructor(@inject("EmployeeModel") private readonly _employeeModel: Model<IEmployee>) {
        super(_employeeModel); // Pass the model to the BaseRepository
    }

    // Add a new onboarding employee
    async addOnboardingEmployee(employeeData: any, managerId: string): Promise<any> {
        try {
            const newEmployee = await this._employeeModel.create({
                ...employeeData,
                managerId,
                "professionalDetails.position": "onboarding", // Set position to onboarding
            });
            return newEmployee;
        } catch (error) {
            console.error("Error adding onboarding employee:", error);
            throw new Error("Failed to add onboarding employee");
        }
    }

    // Get an employee by email
    async getEmployeeByEmail(email: string): Promise<IEmployee | null> {
        try {
            const employee = await this._employeeModel.findOne({ "personalDetails.email": email }).exec();
            return employee;
        } catch (error) {
            console.error("Error fetching employee by email:", error);
            throw new Error("Failed to fetch employee by email");
        }
    }
}
