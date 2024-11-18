import { injectable } from "inversify";
import businessOwnerModel from "../../models/businessOwnerModel";
import IBusinessOwnerRepository from "../interface/IBusinessOwnerRepository";

@injectable()
export default class BusinessOwnerRepository implements IBusinessOwnerRepository {
  
  async fetchAllBusinessOwners(): Promise<any> {
    try {
      return await businessOwnerModel.find({});
    } catch (error) {
      console.error("Error fetching business owners:", error);
      throw new Error("Could not fetch business owners.");
    }
  }

  async registerBusinessOwner(businessOwnerData: string): Promise<any> {
    try {
      const newBusinessOwner = new businessOwnerModel(businessOwnerData);
      return await newBusinessOwner.save();
    } catch (error) {
      console.error("Error registering business owner:", error);
      throw new Error("Could not register business owner.");
    }
  }

  async updateIsBlocked(id: string): Promise<any> {
    try {
      const businessOwner = await businessOwnerModel.findById(id);
      if (!businessOwner) throw new Error("Business owner not found");
      
      businessOwner.isBlocked = !businessOwner.isBlocked;
      return await businessOwner.save();
    } catch (error) {
      console.error("Error updating business owner:", error);
      throw new Error("Could not update business owner.");
    }
  }
}
