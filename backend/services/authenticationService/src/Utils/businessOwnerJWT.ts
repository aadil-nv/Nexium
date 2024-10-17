import jwt, { JwtPayload } from 'jsonwebtoken';
import { IBusinessOwnerDocument } from '../Controllers/interface/IBusinessOwner'; // Import IBusinessOwnerDocument instead of ICompany
import { ObjectId } from 'mongoose'; // Import ObjectId if needed

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';

// Function to generate access token for a company
export const generateCompanyAccessToken = (company: IBusinessOwnerDocument): string => {
    return jwt.sign(
        { id: company._id.toString(), email: company.email }, // Convert _id to string
        JWT_SECRET,
        { expiresIn: '15m' }
    );
};


export const generateCompanyRefreshToken = (company: IBusinessOwnerDocument): string => {
    return jwt.sign(
        { id: company._id.toString(), email: company.email }, // Convert _id to string
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
};


export const verifyCompanyAccessToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
        console.error('Invalid company access token:', error);
        return null;
    }
};

export const verifyCompanyRefreshToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
    } catch (error) {
        console.error('Invalid company refresh token:', error);
        return null;
    }
};
