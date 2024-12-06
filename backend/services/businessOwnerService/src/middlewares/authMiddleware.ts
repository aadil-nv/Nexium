import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import businessOwnerRepository from "../repository/implementation/businessOwnerRepository";
import businessOwnerModel from "../models/businessOwnerModel";

// Update the CustomRequest interface to include the employee data
export interface CustomRequest extends Request {
  user?: JwtPayload & {
    businessOwnerData?: {
      _id: string;
      employeeId: string;
      subscription?: { subscriptionId: string };
    };
  };
}

const authenticateToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
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

    // Attach the decoded user data, including employeeData, to the request
    req.user = {
      ...decoded,
      employeeData: decoded.employeeData || { _id: "", employeeId: "" }, // Ensure employeeData exists
    };

    // Check if business owner is blocked
    const businessOwnerId = decoded.businessOwnerData?._id;
    if (businessOwnerId) {
      const repository = new businessOwnerRepository(businessOwnerModel);

      try {
        // Ensure you're using the businessOwnerModel and checking if blocked
        const isBlocked = await repository.findIsBlocked(businessOwnerId);
        if (isBlocked) {
          return res.status(403).json({ message: "Access denied. Business owner is blocked." });
        }
        next(); // Proceed to the next middleware if not blocked
      } catch (error) {
        return res.status(500).json({ message: "Error checking business owner status." });
      }
    } else {
      return res.status(400).json({ message: "Business owner ID not found in token." });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticateToken;
