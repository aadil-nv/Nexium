import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const secret = process.env.ACCESS_TOKEN_SECRET || 'your_jwt_secret';

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';


export const generateCompanyAccessToken = (data: object): string => {
    
    return jwt.sign(
        data, 
        JWT_SECRET,
        { expiresIn: '15' }
    );
};

export const generateCompanyRefreshToken = (data: object): string => {
    return jwt.sign(
        data, 
        REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    );
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
    } catch {
        return null;
    }
};


export const verifyAccessToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, secret) as JwtPayload;
    } catch {
        return null;
    }
};