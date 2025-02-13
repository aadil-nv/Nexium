import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import employeeModel from '../models/employeeModel';
import EmployeeRepository from '../repository/implementation/employeeRepository';

export interface CustomRequest extends Request {
    user?: JwtPayload & {
      employeeData?: {
        _id: string;
        employeeId: string;
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

        const secret = process.env.ACCESS_TOKEN_SECRET; 
 
        if (!secret) {
            console.error('Access token secret is not defined');
            return res.status(500).json({ message: 'Internal server error' }); 
        }

        // Verify the token
        jwt.verify(token, secret, async (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
            if (err) {
                console.error(`Token verification failed:${err.message}`.bgRed);
                return res.status(401).json({ message: 'Invalid token' });
            }

            req.user = decoded as JwtPayload;
            
            const employeeData = (req.user as JwtPayload).employeeData;
            const repository = new EmployeeRepository(employeeModel);
            const isBusinessOwnerBlocked = await repository.findBusinessOwnerIsBlocked(employeeData._id,employeeData.businessOwnerId)
            if(isBusinessOwnerBlocked){
                return res.status(403).json({ message: "Your account is blocked. Please contact support" });
            }
            const isEmployeeBlocked = await repository.findEmployeeIsBlocked(employeeData._id,employeeData.businessOwnerId)
            if(isEmployeeBlocked){
                return res.status(403).json({ message: "Your account is blocked. Please contact support" });
            }
 
            next(); 
        });

    } catch (error) {
        console.error('Error in authenticateToken:', error);
        return res.status(500).json({ message: 'An error occurred during authentication' });
    }
};

export default authenticateToken;
