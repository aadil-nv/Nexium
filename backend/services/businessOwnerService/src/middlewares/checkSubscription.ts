import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../middlewares/authMiddleware"; // Ensure the correct path
import SubscriptionRepository from "../repository/implementation/subscriptionRepository";
import subscriptionModel from "../models/subscriptionModel";

const checkSubscription = (checkType: string) => {
    
    console.log("checkType", checkType);
    
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const businessOwnerId = req.user?.businessOwnerData?._id;
      console.log("businessOwnerId==============checkSubscription-Middileware============", businessOwnerId);


      if (!businessOwnerId) {
        return res.status(400).json({ message: "Business owner ID not found in token." });
      }

      const repository = new SubscriptionRepository(subscriptionModel);
   
      if (checkType === "servicerequest") {
        const isAllowed = await repository.checkSubscriptionService(businessOwnerId);
        console.log("isAllowed========>", isAllowed);
        

        if (!isAllowed) {
          return res.status(409).json({ message: "Service request limit exceeded. Please upgrade your subscription." });
        }
      }
      if(checkType === "employee"){
        const isAllowed = await repository.checkSubscriptionEmployee(businessOwnerId);
        console.log("isAllowed========>", isAllowed);
        

        if (!isAllowed) {
          return res.status(409).json({ message: "Employee limit exceeded. Please upgrade your subscription." });
        }
      }
      if(checkType === "manager"){
        const isAllowed = await repository.checkSubscriptionManager(businessOwnerId);
        console.log("isAllowed========>", isAllowed);
        

        if (!isAllowed) {
          return res.status(409).json({ message: "Manager limit exceeded. Please upgrade your subscription." });
        }
      }

      next(); // Proceed if subscription is valid
    } catch (error) {
      console.error("Subscription check error:", error);
      return res.status(500).json({ message: "Error checking subscription status." });
    }
  };
};

export default checkSubscription;
