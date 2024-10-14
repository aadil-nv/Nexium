import mongoose from 'mongoose';
import { ICompanyDocument } from '../../entities/ICompany';
import CompanyModel from '../../Schemas/companyRecordsSchema';
import OtpModel from '../../Schemas/otpScheema';

export default class CompanyRepository {
    private useCompanyDb(registrationNumber: string) {
        console.log("CompanyRepository is hitting useCompanyDb ---");
        
        const dbName = `company_${registrationNumber}`; 
        return mongoose.connection.useDb(dbName);
    }
    
   
    async findByEmail(email: string): Promise<ICompanyDocument | null> {
        console.log("CompanyRepository is hitting finfdBYEmail ---");
        console.log("repository email:", email);
    
        return await CompanyModel.findOne({ email }).exec();
    }
    

    async create(companyData: ICompanyDocument): Promise<ICompanyDocument> {
        console.log("CompanyRepository is create  hitting ---");
      
        const company = new CompanyModel(companyData);
        return await company.save();
    }
    
    async findOtpByEmail(email: string): Promise<any | null> {
        console.log("CompanyRepository is hitting findOtpByEmail ---");
        console.log("Searching OTP for email:", email);

        return await OtpModel.findOne({ email }).exec(); // Search OTP based on email in OtpModel
    }

}
