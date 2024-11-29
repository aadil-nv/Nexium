import { injectable, inject } from "inversify";
import { Model } from "mongoose";
import BaseRepository from "./baseRepository";
import IEmployee from "../../entities/employeeEntities";
import IEmployeeRepository from "../../repository/interface/IEmployeeRepository";
import {IManager} from "../../entities/managerEntities";
import managerModel from "../../models/managerModel";

@injectable()
export default class EmployeeRepository extends BaseRepository<IEmployee> implements IEmployeeRepository {
  constructor(@inject("IEmployee") private readonly _employeeModel: Model<IEmployee>) {
    super(_employeeModel);
  }

  async getProfile(employeeId: string): Promise<IEmployee> {

    console.log("hitted get profile-----------------------------------repository",employeeId);
    
    try {
      const employee = await this._employeeModel
        .findOne({ _id: employeeId }) // Adjusted to use `_id` if that's the field
        .select({ password: 0 })
        .exec();

      if (!employee) {
        throw new Error("Employee not found");
      }

      return employee;
    } catch (error: any) {
      throw new Error("Error fetching employee profile: " + error.message);
    }
  }


  async findBusinessOwnerId(managerId: string): Promise<string> {
    try {
        const manager = await managerModel
            .findOne({ _id: managerId })
            .select({ businessOwnerId: 1 })
            .exec();
            console.log(`manager from repository`,manager);
            
        if (!manager || !manager.businessOwnerId) {
            throw new Error("Business owner ID not found for the given manager.");
        }

        return manager.businessOwnerId.toString(); // Return the businessOwnerId as a string
    } catch (error: any) {
        throw new Error("Error fetching business owner ID: " + error.message);
    }
}

}