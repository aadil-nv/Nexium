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
}
