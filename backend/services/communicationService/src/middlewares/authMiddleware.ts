import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import connectDB from '../config/connectDB';
import { HttpStatusCode } from '../utils/enum';

export interface CustomRequest extends Request { 
  user?: JwtPayload & {
    employeeData?: { _id: string; employeeId: string; businessOwnerId: string; role: string };
    businessOwnerData?: { _id: string; businessOwnerId: string };
    managerData?: { _id: string; managerId: string; role: string; businessOwnerId: string };
  };
  dbConnection?: any; 
}

const authenticateToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken;
    
    if (!token) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });

    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });

    jwt.verify(token, secret, async (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Invalid token' });
      }

      req.user = decoded as JwtPayload;
      const user = req.user;
      let role: string | null = null;
      let businessOwnerId: string | undefined;


      try {
        next();
      } catch (error) {
        console.error('Database connection error:', error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Database connection failed' });
      }
    });
  } catch (error) {
    console.error('Error in authenticateToken:', error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred during authentication' });
  }
};

export default authenticateToken;