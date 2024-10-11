import jwt, { JwtPayload } from 'jsonwebtoken';
import { IAdmin } from '../entities/adminEntity'; 

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';


export const generateAccessToken = (admin: IAdmin): string => {
    return jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, {
        expiresIn: '15m', // Access token expires in 15 minutes
    });
};


export const generateRefreshToken = (admin: IAdmin): string => {
    return jwt.sign({ id: admin._id, email: admin.email }, REFRESH_TOKEN_SECRET, {
        expiresIn: '7d', // Refresh token expires in 7 days
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
