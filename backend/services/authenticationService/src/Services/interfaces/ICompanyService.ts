import { ICompanyDocument } from '../../entities/ICompany';

// Define the interface for the company entity
export interface ICompany extends ICompanyDocument {
    password: string; // Add the password field for registration and login
}

// Define the interface for the token response
export interface ITokenResponse {
    accessToken: string;
    refreshToken: string;
}
