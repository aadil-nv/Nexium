import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../middlewares/tokenAuthenticate"; // Ensure the correct path
import ManagerRepository from "../repository/implementation/managerRepository";
import managerModel from "../models/managerModel";
import { HttpStatusCode } from "./../utils/enums";
const checkSubscription = (checkType: string) => {
    
    console.log("checkType", checkType);
    
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const businessOwnerId = req.user?.managerData?.businessOwnerId;


      if (!businessOwnerId) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Business owner ID not found in token." });
      }

      const repository = new ManagerRepository(managerModel);
   
      
      if(checkType === "employee"){
        const isAllowed = await repository.checkSubscriptionEmployee(businessOwnerId);
        

        if (!isAllowed) {
          return res.status(HttpStatusCode.FORBIDDEN).json({ message: "Employee limit exceeded. Please upgrade your subscription." });
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
