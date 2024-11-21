import { inject, injectable } from "inversify";
import IBusinessOwnerRepository from "../interface/IBusinessOwnerRepository";
import BusinessOwnerModel from "../../models/businessOwnerModel";
import BaseRepository from "../implementation/baseRepository";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntity";
import SubscriptionModel from "../../models/subscriptionModel";

@injectable()
export default class BusinessOwnerRepository extends BaseRepository<IBusinessOwnerDocument> implements IBusinessOwnerRepository {
  constructor(
    @inject("BusinessOwnerModel") private _businessOwnerModel: typeof BusinessOwnerModel
  ) {
    super(_businessOwnerModel);
  }

  async registerBusinessOwner(businessOwnerData: any): Promise<IBusinessOwnerDocument> {
    console.log(`businessowner data: ${businessOwnerData}`.bgWhite);
    
    try {
      const newBusinessOwner = new this._businessOwnerModel(businessOwnerData);
      return await newBusinessOwner.save();
    } catch (error) {
      console.error("Error registering business owner:", error);
      throw new Error("Could not register business owner.");
    }
  }

  async addSubscription(subscriptionData: any): Promise<any> {
    try {
      const subscription = new SubscriptionModel(subscriptionData);
      return await subscription.save();
    } catch (error) {
      console.error("Error adding subscription:", error);
      throw new Error("Could not add subscription.");
    }
  }
}
