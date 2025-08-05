import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import businessOwnerRepository from "../repository/implementation/businessOwnerRepository";
import businessOwnerModel from "../models/businessOwnerModel";
import { HttpStatusCode } from "../utils/enums";
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
    return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
  }

  try {
    const decoded = verifyAccessToken(token);


    if (!decoded) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Invalid token" });
    }

    req.user = {
      ...decoded,
      employeeData: decoded.employeeData || { _id: "", employeeId: "" },
    };

    const businessOwnerId = decoded.businessOwnerData?._id;
    if (businessOwnerId) {
      const repository = new businessOwnerRepository(businessOwnerModel);

      try {
        const isBlocked = await repository.findIsBlocked(businessOwnerId);
        if (isBlocked) {
          return res.status(HttpStatusCode.FORBIDDEN).json({ message: "Access denied. Business owner is blocked." });
        }
        next();
      } catch (error) {
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error checking business owner status." });
      }
    } else {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Business owner ID not found in token." });
    }
  } catch (error) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Invalid token" });
  }
};

export default authenticateToken;
