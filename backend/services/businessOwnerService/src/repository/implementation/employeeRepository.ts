import IEmployeeRepository from "../interface/IEmployeeRepository";
import mongoose from "mongoose";
import { injectable } from "inversify";
import EmployeeModel from "../../models/employeeModel";

@injectable()
export default class EmployeeRepository implements IEmployeeRepository {

    async getProfile(employeeId: string, companyId: string): Promise<any> {
       try {
        let switchDb = mongoose.connection.useDb(companyId, { useCache: true });
        const Employee = switchDb.model('Employees', EmployeeModel.schema);
        const employee = await Employee.findById(employeeId);
        return employee
        
       } catch (error) {
        console.error("Error fetching employee profile:", error);
        throw error

       }
    }
}