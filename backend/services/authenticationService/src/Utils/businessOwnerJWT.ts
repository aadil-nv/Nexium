import jwt, { JwtPayload } from 'jsonwebtoken';
import  {IBusinessOwnerDocument}  from '../controllers/interface/IBusinessOwnerController'; 


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';


export const generateCompanyAccessToken = (data: object): string => {
    return jwt.sign(
        data, 
        JWT_SECRET,
        { expiresIn: '15m' }
    );
};

export const generateCompanyRefreshToken = (data: object): string => {
    return jwt.sign(
        data, 
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
};


