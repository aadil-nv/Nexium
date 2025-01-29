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


// Repository layer function to get dashboard data
async getDashboardData(companyId: string): Promise<any> {
  try {
    // Switch to the correct database using the companyId
    const _switchDb = mongoose.connection.useDb(companyId, { useCache: true });

    // Define the Employee model for the switched database
    const Employee = _switchDb.model('Employees', EmployeeModel.schema);

    // Get the total count of employees
    const totalEmployees = await Employee.countDocuments();

    // Get the count of active employees
    const activeEmployees = await Employee.countDocuments({ isActive: true });

    // Get the count of verified employees
    const verifiedEmployees = await Employee.countDocuments({ isVerified: true });

    // Return the collected data for the dashboard
    return {
      totalEmployees,
      activeEmployees,
      verifiedEmployees,
    };
  } catch (error) {
    console.error("Error retrieving dashboard data: ", error);
    throw new Error("Failed to fetch dashboard data.");
  }
}


}
