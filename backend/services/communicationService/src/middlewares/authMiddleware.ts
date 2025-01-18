import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import connectDB from '../config/connectDB';

export interface CustomRequest extends Request {
  user?: JwtPayload & {
    employeeData?: { _id: string; employeeId: string; businessOwnerId: string; role: string };
    businessOwnerData?: { _id: string; businessOwnerId: string };
    managerData?: { _id: string; managerId: string; role: string; businessOwnerId: string };
  };
}


const authenticateToken = async (req: CustomRequest, res: Response, next: NextFunction) => {

  try {
    const token = req.cookies?.accessToken;
    
    if (!token) return res.status(401).json({ message: "Access denied. No token provided" });

    const secret = process.env.ACCESS_TOKEN_SECRET 
    if (!secret) return res.status(500).json({ message: 'Internal server error' });

    jwt.verify(token, secret, async (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err ) {

        return res.status(401).json({ message: 'Invalid token' });
      }

      req.user = decoded as JwtPayload;
      const user = req.user;
      let role: string | null = null;
      let businessOwnerId: string | undefined;

      if (user.employeeData) {
        role = user.employeeData.role;
        businessOwnerId = user.employeeData.businessOwnerId;
      } else if (user.managerData) {
        role = user.managerData.role;
        businessOwnerId = user.managerData.businessOwnerId;
      } else if (user.businessOwnerData) {
        role = 'businessOwner';
        businessOwnerId = user.businessOwnerData._id;
      }

      if (!role || !businessOwnerId) {
        return res.status(401).json({ message: "Invalid token or missing business owner ID" });
      }

      await connectDB(businessOwnerId.toString());
      console.log(`${role} authenticated. Connected to business owner DB for ID: ${businessOwnerId}`);
      next();
    });
  } catch (error) {
    console.error('Error in authenticateToken:', error);
    return res.status(500).json({ message: 'An error occurred during authentication' });
  }
};

export default authenticateToken;
