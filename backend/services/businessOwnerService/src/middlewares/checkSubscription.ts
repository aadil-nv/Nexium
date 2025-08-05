import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../middlewares/authMiddleware"; // Ensure the correct path
import SubscriptionRepository from "../repository/implementation/subscriptionRepository";
import subscriptionModel from "../models/subscriptionModel";
import { HttpStatusCode } from "../utils/enums";

const checkSubscription = (checkType: string) => {
        
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const businessOwnerId = req.user?.businessOwnerData?._id;

      if (!businessOwnerId) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Business owner ID not found in token." });
      }

      const repository = new SubscriptionRepository(subscriptionModel);
   
      if (checkType === "servicerequest") {
        const isAllowed = await repository.checkSubscriptionService(businessOwnerId);
        

        if (!isAllowed) {
          return res.status(HttpStatusCode.CONFLICT).json({ message: "Service request limit exceeded. Please upgrade your subscription." });
        }
      }
      if(checkType === "employee"){
        const isAllowed = await repository.checkSubscriptionEmployee(businessOwnerId);
        

        if (!isAllowed) {
          return res.status(HttpStatusCode.CONFLICT).json({ message: "Employee limit exceeded. Please upgrade your subscription." });
        }
      }
      if(checkType === "manager"){
        const isAllowed = await repository.checkSubscriptionManager(businessOwnerId);
        

        if (!isAllowed) {
          return res.status(HttpStatusCode.CONFLICT).json({ message: "Manager limit exceeded. Please upgrade your subscription." });
        }
      }

      next();
    } catch (error) {
      console.error("Subscription check error:", error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error checking subscription status." });
    }
  };
};

export default checkSubscription;
