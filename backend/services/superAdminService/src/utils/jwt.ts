import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const secret = process.env.ACCESS_TOKEN_SECRET || 'your_jwt_secret';

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';


export const generateAccessToken = (data: object): string => {
    console.log("Generating access token..." ,data);
    
    return jwt.sign(
        data, 
        JWT_SECRET,
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
// Verify the refresh token
export const verifyRefreshToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
    } catch {
        return null;
    }
};

// Verify the access token
export const verifyAccessToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, secret) as JwtPayload;
    } catch {
        return null;
    }
};
