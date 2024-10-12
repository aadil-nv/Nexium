// services/CompanyService.ts
import { ICompany, ICompanyDocument, ITokenResponse } from '../../entities/ICompany';
import CompanyRepository from '../../Repositery/implementaion/companyRepositery'; // Assuming this is the correct path
import bcrypt from 'bcryptjs';
import { generateCompanyAccessToken, generateCompanyRefreshToken } from '../../Utils/companyJwt';
import mongoose from 'mongoose';
import CompanyModel from '../../Schemas/companyRecordsSchema'; // Import your Mongoose model

export class CompanyService {
    private companyRepository: CompanyRepository;

    constructor() {
        this.companyRepository = new CompanyRepository();
    }

    async register(companyData: Partial<ICompany>): Promise<ITokenResponse> {
        // Hash password if it exists
        if (companyData.password) {
            companyData.password = await bcrypt.hash(companyData.password, 10);
        }

        // Ensure registration number is provided
        if (!companyData.registrationNumber) {
            throw new Error('Registration number is required');
        }

        // Create a new database for the company
        const companyDbName = `company_${companyData.registrationNumber}`; // Define the company database name
        const companyDb = mongoose.connection.useDb(companyDbName);
        
        // Create a dummy collection to initialize the database
        await companyDb.createCollection('users'); // Create a 'users' collection in the new tenant database

        // Prepare the new company data
        const newCompanyData: ICompanyDocument = new CompanyModel({
            _id: new mongoose.Types.ObjectId(),
            name: companyData.name || '',
            email: companyData.email || '',
            address: companyData.address || '',
            password: companyData.password || '',
            phone: companyData.phone || '',
            website: companyData.website,
            registrationNumber: companyData.registrationNumber, // Keep this to satisfy the type
            documents: companyData.documents || [],
            subscription: companyData.subscription || {
                planName: 'Trial',
                planType: 'Trial',
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                status: 'Active',
            },
        });

        // Save the company data in the main companies collection
        const savedCompany = await this.companyRepository.create(newCompanyData);

        // Return tokens for the registered company
        const tokens = this.generateTokens(savedCompany);
        return tokens;
    }

    async login(email: string, password: string, registrationNumber: string): Promise<ITokenResponse> {
        // Find the company by email
        const company = await this.companyRepository.findByEmail(email, registrationNumber);
        if (!company) {
            throw new Error('Company not found');
        }

        // Check the password
        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        return this.generateTokens(company);
    }

    generateTokens(company: ICompanyDocument): ITokenResponse {
        const accessToken = generateCompanyAccessToken(company);
        const refreshToken = generateCompanyRefreshToken(company);
        return { accessToken, refreshToken };
    }
}
