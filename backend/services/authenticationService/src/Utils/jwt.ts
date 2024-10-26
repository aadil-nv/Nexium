import jwt, { JwtPayload } from 'jsonwebtoken';
import { ISuperAdmin } from '../controllers/interface/ISuperAdminController'; 


const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET  as string;




export const generateAccessToken = (admin :ISuperAdmin ): string => {
    
    return jwt.sign({admin}, JWT_SECRET, {expiresIn: '15m',});
};


export const generateRefreshToken = (admin :Object)=> {
    
    return jwt.sign({admin}, REFRESH_TOKEN_SECRET, {
        expiresIn: '7d', 
    });
};


export const verifyAccessToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload; 
    } catch {
        return null;
    }
};


export const verifyRefreshToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload; // Verify refresh token
    } catch {
        return null;
    }
};
