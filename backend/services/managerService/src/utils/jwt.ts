import jwt, { JwtPayload } from 'jsonwebtoken';




const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string
const ACCESS_TOKEN_SECRET= process.env.ACCESS_TOKEN_SECRET as string


console.log( "REFRESH_TOKEN_SECRET ----", REFRESH_TOKEN_SECRET);
console.log("ACCESS_TOKEN_SECRET   -----",ACCESS_TOKEN_SECRET);


export const generateAccessToken = (data: object): string => {
    console.log("Generating access token..." ,data);
    
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
        { expiresIn: '2m' }
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


