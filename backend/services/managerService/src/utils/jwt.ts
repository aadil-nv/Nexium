import jwt, { JwtPayload } from 'jsonwebtoken';

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string
const ACCESS_TOKEN_SECRET= process.env.ACCESS_TOKEN_SECRET as string


export const generateAccessToken = (data: object): string => {
   
    
    return jwt.sign(
        data, 
        ACCESS_TOKEN_SECRET,
        { expiresIn: '1m' }
    );
};

export const generateRefreshToken = (data: object): string => {
    return jwt.sign(
        data, 
        REFRESH_TOKEN_SECRET,
        { expiresIn: '4m' }
    );
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, "Admin@123") as JwtPayload; // Verify refresh token
    } catch {
        return null;
    }
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload; 
    } catch {
        return null;
    }
};


