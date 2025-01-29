import { injectable } from "inversify";
import businessOwnerModel from "../../models/businessOwnerModel";
import IBusinessOwnerRepository from "../interface/IBusinessOwnerRepository";
import subscriptionModel from "../../models/subscriptionModel";

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

  async getDashboardData(): Promise<any> {
    try {
      const startOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const endOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
      const startOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
      const endOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0);

      // 1. Total count of business owners
      const totalBusinessOwners = await businessOwnerModel.countDocuments();

      // 2. Last added business owner
      const lastAddedBusinessOwner = await businessOwnerModel
        .findOne()
        .sort({ createdAt: -1 })
        .select("personalDetails.businessOwnerName companyDetails.companyName companyDetails.companyLogo createdAt");

      let lastAddedBusinessOwnerCount = 0;
      if (lastAddedBusinessOwner) {
        // Count how many business owners were added at the same time
        lastAddedBusinessOwnerCount = await businessOwnerModel.countDocuments({
          createdAt: lastAddedBusinessOwner.createdAt,
        });
      }

      // 3. Business owners added this month
      const thisMonthBusinessOwners = await businessOwnerModel.countDocuments({
        createdAt: { $gte: startOfCurrentMonth, $lt: endOfCurrentMonth },
      });

      // 4. Business owners added last month
      const lastMonthBusinessOwners = await businessOwnerModel.countDocuments({
        createdAt: { $gte: startOfLastMonth, $lt: endOfLastMonth },
      });

      // 5. Plan-wise subscription count and total revenue
      const planCountsAndRevenue = await businessOwnerModel.aggregate([
        {
          $lookup: {
            from: "subscriptions", // Ensure the collection name is correct
            localField: "subscription.subscriptionId",
            foreignField: "_id",
            as: "subscriptionDetails",
          },
        },
        {
          $unwind: "$subscriptionDetails",
        },
        {
          $group: {
            _id: "$subscriptionDetails.planName",
            count: { $sum: 1 },
            totalRevenue: { $sum: "$subscriptionDetails.price" },
          },
        },
        {
          $project: {
            planName: "$_id",
            count: 1,
            totalRevenue: 1,
            _id: 0,
          },
        },
      ]);

      // 6. Subtotal revenue
      const subTotalRevenue = planCountsAndRevenue.reduce((total, plan) => total + plan.totalRevenue, 0);

      // 7. Latest 4 added business owners with their company logo and details
      const latestAddedBusinessOwners = await businessOwnerModel
        .find({})
        .sort({ createdAt: -1 })
        .limit(4)
        .select("companyDetails.companyLogo companyDetails.companyName personalDetails.businessOwnerName createdAt");

    
      
      return {
        totalBusinessOwners,
        lastAddedBusinessOwner,
        lastAddedBusinessOwnerCount,
        thisMonthBusinessOwners,
        lastMonthBusinessOwners,
        planCountsAndRevenue,
        subTotalRevenue,
        latestAddedBusinessOwners,
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw new Error("Failed to fetch dashboard data.");
    }
  }
}
