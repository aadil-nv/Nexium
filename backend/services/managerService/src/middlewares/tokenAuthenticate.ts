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
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided" });
    }

    const secret = process.env.ACCESS_TOKEN_SECRET; // Get the secret from environment variables
    if (!secret) {
      console.error("Access token secret is not defined");
      return res.status(500).json({ message: "Internal server error" }); // Return a 500 error if the secret is not defined
    }

    // Verify the token
    jwt.verify(token, secret, async (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ message: "Invalid token" });
      }

      req.user = decoded as JwtPayload; // Attach the decoded user info to the request

      // Extract manager data
      const managerData = req.user?.managerData;
      if (!managerData || !managerData.businessOwnerId) {
        return res.status(401).json({ message: "Business owner ID not found in manager data" });
      }

      const { _id: managerId, businessOwnerId } = managerData;

      // Dynamically connect to the MongoDB database using businessOwnerId
      await connectDB(businessOwnerId); // Pass the businessOwnerId to the connectDB function

      // Create an instance of the ManagerRepository
      const managerRepo = new ManagerRepository(managerModel); // Pass managerModel here

      // Check if manager is blocked using the repository method
      const isBlocked = await managerRepo.findIsBlocked(managerId); // Using the correct managerId here
      console.log("isBlocked===================?>", isBlocked);
      
      if (isBlocked === null) {
        return res.status(404).json({ message: "Manager not found" });
      }

      if (isBlocked) {
        return res.status(403).json({ message: "Manager is blocked" });
      }

      next(); // Proceed to the next middleware
    });
  } catch (error) {
    console.error("Error in authenticateToken:", error);
    return res.status(500).json({ message: "An error occurred during authentication" });
  }
};

export default authenticateToken;
