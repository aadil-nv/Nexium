import { ICompany, ICompanyDocument, ITokenResponse } from '../../entities/ICompany';
import CompanyRepository from '../../Repositery/implementaion/companyRepositery'; // Assuming this is the correct path
import bcrypt from 'bcryptjs';
import { generateCompanyAccessToken, generateCompanyRefreshToken } from '../../Utils/companyJwt';
import mongoose from 'mongoose';

export class CompanyService {
    private companyRepository: CompanyRepository;

    constructor() {
        this.companyRepository = new CompanyRepository();
    }

    async register(companyData: Partial<ICompanyDocument>): Promise<ITokenResponse> {
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
        await mongoose.connection.useDb(companyDbName).createCollection('dummyCollection'); // Create a dummy collection to initialize the database

        // Prepare the new company data ensuring required fields are included
        const newCompanyData: ICompanyDocument = {
            _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId
            name: companyData.name || '', // Ensure name is provided
            email: companyData.email || '', // Ensure email is provided
            address: companyData.address || '', // Ensure address is provided
            password: companyData.password || '', // Ensure password is provided
            phone: companyData.phone || '', // Ensure phone is provided
            website: companyData.website || '', // Optional field
            registrationNumber: companyData.registrationNumber, // Required
            documents: companyData.documents || [], // Optional
            subscription: companyData.subscription || { // Optional subscription
                planName: 'Trial',
                planType: 'Trial',
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year later
                status: 'Active',
            },
        } as ICompanyDocument; // Cast to ICompanyDocument

        // Save the company using the repository
        const newCompany = await this.companyRepository.create(newCompanyData); // Pass the complete company data

        // Generate tokens
        const tokens = this.generateTokens(newCompany); // Pass the newCompany which is of type ICompanyDocument
        return tokens;
    }

    generateTokens(company: ICompanyDocument): ITokenResponse { // Accept ICompanyDocument instead of ICompany
        const accessToken = generateCompanyAccessToken(company);
        const refreshToken = generateCompanyRefreshToken(company);
        return { accessToken, refreshToken };
    }

    async login(email: string, password: string, registrationNumber: string): Promise<ITokenResponse> {
        const company = await this.companyRepository.findByEmail(email, registrationNumber); // Fetch by email

        if (!company) {
            throw new Error('Company not found');
        }

        const isPasswordValid = await bcrypt.compare(password, company.password);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const tokens = this.generateTokens(company); // company is already ICompanyDocument
        return tokens;
    }
}
