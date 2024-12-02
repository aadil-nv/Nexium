import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

// Update the CustomRequest interface to include the employee data
export interface CustomRequest extends Request {
  user?: JwtPayload & {
    businessOwnerData?: {
      _id: string;
      employeeId: string;
    };
  };
}

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
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
      employeeData: decoded.employeeData || { _id: "", employeeId: "" } // Ensure employeeData exists
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticateToken;
