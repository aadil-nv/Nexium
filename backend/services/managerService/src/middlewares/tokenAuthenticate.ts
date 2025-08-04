import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import managerModel from "../models/managerModel";
import ManagerRepository from "../repository/implementation/managerRepository";

export interface CustomRequest extends Request {
  user?: JwtPayload & { managerData?: { _id: string; businessOwnerId: string } };
}

const authenticateToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  
  try {
    const token = req.cookies.accessToken;
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
  

    const secret = process.env.ACCESS_TOKEN_SECRET;
  
    if (!secret) return res.status(500).json({ message: "Internal server error" });
  ;

    const decoded = jwt.verify(token, secret) as JwtPayload;
   
    if (!decoded || !decoded.managerData?._id || !decoded.managerData.businessOwnerId) {
      
      return res.status(401).json({ message: "Invalid token data" });
    }
    req.user = decoded;

    const { _id, businessOwnerId } = decoded.managerData;
    const repository = new ManagerRepository(managerModel);

    const [isBusinessOwnerBlocked, isBlocked] = await Promise.all([
      repository.findBusinessOwnerIsBlocked(_id, businessOwnerId),
      repository.findIsBlocked(_id, businessOwnerId),
    ]);

    if (isBusinessOwnerBlocked) return res.status(403).json({ message: "Business owner is blocked by you." });
    if (isBlocked) return res.status(403).json({ message: "Business owner is blocked." });

    next();
  } catch (error) {
    console.error("Error in authenticateToken:", error);
    return res.status(401).json({ message: "Authentication error" });
  }
};

export default authenticateToken;
