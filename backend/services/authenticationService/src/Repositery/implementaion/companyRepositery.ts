import mongoose from 'mongoose';
import { ICompanyDocument } from '../../entities/ICompany';
import CompanyModel from '../../Schemas/companyRecordsSchema';

export default class CompanyRepository {
    private useCompanyDb(registrationNumber: string) {
        
        const dbName = `company_${registrationNumber}`; 
        return mongoose.connection.useDb(dbName);
    }
    
   
    async findByEmail(email: string): Promise<ICompanyDocument | null> {
        console.log("CompanyRepository is hitting ---");
        console.log("repository email:", email);
    
        return await CompanyModel.findOne({ email }).exec();
    }
    

    async create(companyData: ICompanyDocument): Promise<ICompanyDocument> {
        const company = new CompanyModel(companyData);
        return await company.save();
    }
    

}
