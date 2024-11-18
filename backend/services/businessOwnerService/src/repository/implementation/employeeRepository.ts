import IEmployeeRepository from "../interface/IEmployeeRepository";
import mongoose from "mongoose";
import { injectable } from "inversify";
import EmployeeModel from "../../models/employeeModel";

@injectable()
export default class EmployeeRepository implements IEmployeeRepository {
  
  async getProfile(employeeId: string, companyId: string): Promise<any> {
    try {
      const _switchDb = mongoose.connection.useDb(companyId, { useCache: true });
      const Employee = _switchDb.model('Employees', EmployeeModel.schema);
      return await Employee.findById(employeeId);
    } catch (error) {
      console.error("Error fetching employee profile:", error);
      throw error;
    }
  }
}
