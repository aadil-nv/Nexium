import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import  connectDB  from '../config/connectDB'; 
import { access } from 'fs';


export interface CustomRequest extends Request {
    user?: JwtPayload & {
      employeeData?: {
        _id: string;
        employeeId: string;
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
            if (employeeData && employeeData.businessOwnerId) {
                const businessOwnerId = employeeData.businessOwnerId.toString();

             
                await connectDB(businessOwnerId); 
            } else {
                return res.status(401).json({ message: "Business owner ID not found in manager data" });
            }

            next(); // Call the next middleware
        });

    } catch (error) {
        console.error('Error in authenticateToken:', error);
        return res.status(500).json({ message: 'An error occurred during authentication' });
    }
};

export default authenticateToken;
