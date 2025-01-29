import managerModel from "../models/managerModel"; // Add this import
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import connectDB from "../config/connectDB"; // Import connectDB function
import ManagerRepository from "../repository/implementation/managerRepository"; // Import the ManagerRepository

// Extend the Request interface to include the user property
export interface CustomRequest extends Request {
  user?: JwtPayload & {
    managerData?: {
      _id: string;
      businessOwnerId: string;
    };
  };
}

const authenticateToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Access denied from middleware. No token provided" });
    }

    const secret = process.env.ACCESS_TOKEN_SECRET; 
    if (!secret) {
      console.error("Access token secret is not defined");
      return res.status(500).json({ message: "Internal server error" }); 
    }


    jwt.verify(token, secret, async (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ message: "Invalid token" });
      }

      req.user = decoded as JwtPayload; 


      const managerData = req.user?.managerData;
      if (!managerData || !managerData.businessOwnerId) {
        return res.status(401).json({ message: "Business owner ID not found in manager data" });
      }

      const { _id: managerId, businessOwnerId } = managerData;


      await connectDB(businessOwnerId); 

      const managerRepo = new ManagerRepository(managerModel); 

      const isBlocked = await managerRepo.findIsBlocked(managerId); 
      
      if (isBlocked === null) {
        return res.status(404).json({ message: "Manager not found" });
      }

      if (isBlocked) {
        return res.status(403).json({ message: "Manager is blocked" });
      }

      next();
    });
  } catch (error) {
    console.error("Error in authenticateToken:", error);
    return res.status(500).json({ message: "An error occurred during authentication" });
  }
};

export default authenticateToken;
