import IBaseRepository from "repository/interface/IBaseRepository";
import subscriptionModel from "../../models/subscriptionModel";
import { injectable } from "inversify";


@injectable()
class BaseRepository implements IBaseRepository {
        async findByName(planeName: string): Promise<any> {
           try {
            const subscription = await subscriptionModel.findOne({planName: planeName});
            return subscription

           } catch (error) {
            console.error("Error finding subscription:", error);
            throw new Error("Could not find subscription.");
           }
        }

        async findById(id: string): Promise<any> {
            try {
              const subscription = await subscriptionModel.findById(id);
              return subscription;
            } catch (error) {
              console.error("Error finding subscription:", error);
              throw new Error("Could not find subscription.");
            }
          }
          
        async findByIdAndUpdate(id: string, data: any): Promise<any> {
            try {
              const updatedSubscription = await subscriptionModel.findByIdAndUpdate(id, data, { new: true });
              return updatedSubscription;
            } catch (error) {
              console.error("Error updating subscription:", error);
              throw new Error("Could not update subscription.");
            }
          }
          
          
    }
    
    export default BaseRepository;