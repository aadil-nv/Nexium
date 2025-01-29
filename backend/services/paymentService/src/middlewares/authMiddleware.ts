import { JwtPayload } from "jsonwebtoken";
import e, { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import BaseRepository from "../repository/implementation/baseRepository"; // Adjust the import path if needed
import BusinessOwnerModel from "../models/businessOwnerModel"; // Import the business owner model

// Update the CustomRequest interface to include the employee data
export interface CustomRequest extends Request {
  user?: JwtPayload & {
    businessOwnerData?: {
      _id: string;
      employeeId: string;
      subscription?: { subscriptionId: string };
      emial?: string;
      personalDetails?: {email: string};
    };
  };
}

const authenticateToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  console.log("Inside authenticateToken middleware");

  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided" });
  }

  try {
    // Verify and decode the token
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach the decoded user data to the request
    req.user = {
      ...decoded,
      employeeData: decoded.employeeData || { _id: "", employeeId: "" ,email:""}, // Ensure employeeData exists
    };

    const businessOwnerId = decoded.businessOwnerData?._id;

    if (!businessOwnerId) {
      return res.status(400).json({ message: "Business owner ID not found in token." });
    }

    try {
      // Create an instance of the base repository for the business owner model
      const businessOwnerRepository = new BaseRepository(BusinessOwnerModel);

      // Find the business owner by ID
      const businessOwner = await businessOwnerRepository.findOne({ _id: businessOwnerId });

      console.log("Business owner found:=======from middleware", businessOwner);
      

      if (!businessOwner) {
        return res.status(404).json({ message: "Business owner not found." });
      }

      if (businessOwner.isBlocked) { // Assuming `isBlocked` is a field in the business owner model
        return res.status(403).json({ message: "Access denied. Business owner is blocked." });
      }

      next(); // Proceed to the next middleware if not blocked
    } catch (error) {
      console.error("Error finding business owner:", error);
      return res.status(500).json({ message: "Error checking business owner status." });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticateToken;
