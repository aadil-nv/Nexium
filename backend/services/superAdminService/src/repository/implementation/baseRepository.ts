import IBaseRepository from "repository/interface/IBaseRepository";
import subscriptionModel from "../../models/subscriptionModel";
import { injectable } from "inversify";

@injectable()
class BaseRepository implements IBaseRepository {
  async findByName(planName: string): Promise<any> {
    try {
      return await subscriptionModel.findOne({ planName });
    } catch (error) {
      console.error("Error finding subscription:", error);
      throw new Error("Could not find subscription.");
    }
  }

  async findById(id: string): Promise<any> {
    try {
      return await subscriptionModel.findById(id);
    } catch (error) {
      console.error("Error finding subscription:", error);
      throw new Error("Could not find subscription.");
    }
  }

  async findByIdAndUpdate(id: string, data: any): Promise<any> {
    try {
      return await subscriptionModel.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw new Error("Could not update subscription.");
    }
  }
}

export default BaseRepository;
