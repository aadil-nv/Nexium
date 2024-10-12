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
        console.log("CompanyRepository is hitting ---");
        try {
            // Check if a company with the same name already exists
            const existingCompany = await CompanyModel.findOne({ name: companyData.name });
            if (existingCompany) {
                throw new Error(`Company with name ${companyData.name} already exists.`);
            }
    
            const newCompany = new CompanyModel(companyData);
            return await newCompany.save();
        } catch (error) {
            console.error('Error creating new company:', error); // Log full error
            throw new Error('Error creating new company');
        }
    }
    

    // Find company by ID in the company's database
    async findById(id: string, registrationNumber: string): Promise<ICompanyDocument | null> {
        try {
            const companyModel = this.useCompanyDb(registrationNumber).model<ICompanyDocument>('Company', CompanyModel.schema);
            return await companyModel.findById(id).exec();
        } catch (error) {
            console.error('Error finding company by ID:', error);
            throw new Error('Error finding company by ID');
        }
    }

    // Update company details in the company's database
    async update(id: string, updateData: Partial<ICompanyDocument>, registrationNumber: string): Promise<ICompanyDocument | null> {
        try {
            const companyModel = this.useCompanyDb(registrationNumber).model<ICompanyDocument>('Company', CompanyModel.schema);
            return await companyModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
        } catch (error) {
            console.error('Error updating company:', error);
            throw new Error('Error updating company');
        }
    }

    // Delete company by ID in the company's database
    async deleteById(id: string, registrationNumber: string): Promise<void> {
        try {
            const companyModel = this.useCompanyDb(registrationNumber).model<ICompanyDocument>('Company', CompanyModel.schema);
            await companyModel.findByIdAndDelete(id).exec();
        } catch (error) {
            console.error('Error deleting company by ID:', error);
            throw new Error('Error deleting company');
        }
    }

    // List all companies (this method can be adapted as needed)
    async listAll(registrationNumber: string): Promise<ICompanyDocument[]> {
        try {
            const companyModel = this.useCompanyDb(registrationNumber).model<ICompanyDocument>('Company', CompanyModel.schema);
            return await companyModel.find().exec();
        } catch (error) {
            console.error('Error listing companies:', error);
            throw new Error('Error listing companies');
        }
    }
}
