import mongoose from 'mongoose';
import { ICompanyDocument } from '../../entities/ICompany';
import CompanyModel from '../../Schemas/companyRecordsSchema';

export default class CompanyRepository {
    // Use the company's database based on registration number
    private useCompanyDb(registrationNumber: string) {
        const dbName = `company_${registrationNumber}`; // Define the company-specific database name
        return mongoose.connection.useDb(dbName);
    }

    // Find company by email in the company's database
    async findByEmail(email: string, registrationNumber: string): Promise<ICompanyDocument | null> {
        console.log("CompanyRepository: Finding company by email ---");
        
        try {
            const companyModel = this.useCompanyDb(registrationNumber).model<ICompanyDocument>('Company', CompanyModel.schema);
            return await companyModel.findOne({ email }).exec();
        } catch (error) {
            console.error('Error finding company by email:', error);
            throw new Error('Error finding company by email');
        }
    }

    // Create a new company in the company's database
    async create(companyData: ICompanyDocument): Promise<ICompanyDocument> {
        const company = new CompanyModel(companyData);
        return await company.save();
    }
    
    // ... Other repository methods (findById, update, deleteById, listAll) remain unchanged
}
