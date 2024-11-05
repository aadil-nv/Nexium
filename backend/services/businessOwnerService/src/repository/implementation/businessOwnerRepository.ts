import IBusinessOwnerRepository from "../interface/IBusinessOwnerRepository";
import  IManager  from "../../entities/managerEntity";
import ManagerModel from "../../models/managerModel"; 
import { injectable } from "inversify";
import mongoose from "mongoose";
import BusinessOwnerModel from "../../models/businessOwnerModel";

@injectable()
export default class BusinessOwnerRepository implements IBusinessOwnerRepository {

  async addManagers(companyId:string,hrManagerData: IManager): Promise<IManager> {
    const switchDb =mongoose.connection.useDb(companyId, { useCache: true })
    const Manager = switchDb.model('Managers', ManagerModel.schema);
    const newManager = new Manager(hrManagerData)
    return await newManager.save();
  }

  async findAllManagers(companyId: string): Promise<any[]> {
    try {
      const switchDb = mongoose.connection.useDb(companyId, { useCache: true });
      const Manager = switchDb.model('Managers', ManagerModel.schema);
      const managers = await Manager.find(); 
      return managers; 
  } catch (error) {
      console.error("Error fetching managers:", error);
      throw new Error("Could not fetch managers.");
  }
}

async registerBusinessOwner(businessOwnerData: string): Promise<any> {
  try {
      const newBusinessOwner = new BusinessOwnerModel(businessOwnerData);
      return await newBusinessOwner.save();
  } catch (error) {
      console.error("Error registering business owner:", error);
      throw new Error("Could not register business owner.");
  } 
}
}
