import { JwtPayload } from "jsonwebtoken";
import e, { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import BaseRepository from "../repository/implementation/baseRepository"; // Adjust the import path if needed
import BusinessOwnerModel from "../models/businessOwnerModel"; // Import the business owner model
import { HttpStatusCode } from "../utils/enums";

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

  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
  }

  try {
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Invalid token" });
    }

    req.user = {
      ...decoded,
      employeeData: decoded.employeeData || { _id: "", employeeId: "" ,email:""}, // Ensure employeeData exists
    };

    const businessOwnerId = decoded.businessOwnerData?._id;

    if (!businessOwnerId) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Business owner ID not found in token." });
    }

    try {
      const businessOwnerRepository = new BaseRepository(BusinessOwnerModel);

      const businessOwner = await businessOwnerRepository.findOne({ _id: businessOwnerId });
      

      if (!businessOwner) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ message: "Business owner not found." });
      }

      if (businessOwner.isBlocked) { 
        return res.status(HttpStatusCode.FORBIDDEN).json({ message: "Access denied. Business owner is blocked." });
      }

      next(); // Proceed to the next middleware if not blocked
    } catch (error) {
      console.error("Error finding business owner:", error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error checking business owner status." });
    }
  } catch (error) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Invalid token" });
  }
};

export default authenticateToken;
