import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../middlewares/tokenAuthenticate"; // Ensure the correct path
import ManagerRepository from "../repository/implementation/managerRepository";
import managerModel from "../models/managerModel";
const checkSubscription = (checkType: string) => {
    
    console.log("checkType", checkType);
    
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const businessOwnerId = req.user?.managerData?.businessOwnerId;
      console.log("businessOwnerId==============checkSubscription-Middileware============", businessOwnerId);


      if (!businessOwnerId) {
        return res.status(400).json({ message: "Business owner ID not found in token." });
      }

      const repository = new ManagerRepository(managerModel);
   
      
      if(checkType === "employee"){
        const isAllowed = await repository.checkSubscriptionEmployee(businessOwnerId);
        console.log("isAllowed========>", isAllowed);
        

        if (!isAllowed) {
          return res.status(409).json({ message: "Employee limit exceeded. Please upgrade your subscription." });
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
