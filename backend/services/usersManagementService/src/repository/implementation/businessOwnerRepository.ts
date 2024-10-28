import IBusinessOwnerRepository from "../interface/IBusinessOwnerRepository";
import  IManager  from "../../entities/managerEntity";
import ManagerModel from "../../models/managerSchema"; 
import { injectable } from "inversify";
import companyModel  from "../../models/businessOwnerSchema";
import mongoose from "mongoose";

@injectable()
export default class BusinessOwnerRepository implements IBusinessOwnerRepository {

  async addManagers(companyId:string,hrManagerData: IManager): Promise<IManager> {
    console.log("companyId from repo -->",companyId);

    const dbConnection =await mongoose.connection.useDb(companyId, { useCache: true });
    console.log("db connection from -->",dbConnection);
    const Manager =await dbConnection.model('HRManager', ManagerModel.schema);

    
    const newManager = new Manager(hrManagerData);
    return await newManager.save();
  }

  async findAllCompanies(): Promise<any[]> {
    try {
        const companies = await companyModel.find(); // Fetch all companies from the database
        return companies; // Return the list of companies
    } catch (error) {
        console.error("Error fetching companies:", error);
        throw new Error("Could not fetch companies."); // Handle the error appropriately
    }
}
}
