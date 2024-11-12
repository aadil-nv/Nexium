import jwt, { JwtPayload } from 'jsonwebtoken';



const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';


export const generateCompanyAccessToken = (data: object): string => {
    console.log("Generating access token..." ,data);
    
    return jwt.sign(
        data, 
        JWT_SECRET,
        { expiresIn: '1m' }
    );
};

export const generateCompanyRefreshToken = (data: object): string => {
    return jwt.sign(
        data, 
        REFRESH_TOKEN_SECRET,
        { expiresIn: '5m' }
    );
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload; // Verify refresh token
    } catch {
        return null;
    }
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload; 
    } catch {
        return null;
    }
};


