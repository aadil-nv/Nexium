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
            return await this.findAll();
        } catch (error) {
            console.error("Error finding employees:", error);
            return [];
        }
    }

    async addEmployee(employeeData: IEmployee): Promise<IEmployee> {
        try {
            const employee = new this.employeeModel(employeeData);
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
}
