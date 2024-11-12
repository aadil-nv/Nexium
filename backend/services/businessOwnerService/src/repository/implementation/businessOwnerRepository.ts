import IBusinessOwnerRepository from "../interface/IBusinessOwnerRepository";
import  IManager  from "../../entities/managerEntity";
import ManagerModel from "../../models/managerModel"; 
import { injectable } from "inversify";
import mongoose from "mongoose";
import BusinessOwnerModel from "../../models/businessOwnerModel";

@injectable()
export default class BusinessOwnerRepository implements IBusinessOwnerRepository {

 

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
