import ISuperAdminRepository from "../interface/ISuperAdminRepository";
import Company from "../../models/businessOwnerSchema"; 
import { ICompany } from "../interface/ISuperAdminRepository";

class SuperAdminRepository implements ISuperAdminRepository {

  async getAllCompanies(): Promise<ICompany[]> {
    return await Company.find(); 
  }


  async getCompanyById(id: string): Promise<ICompany | null> {
    return await Company.findById(id);
  }

  // Method to create a new company
  async createCompany(company: ICompany): Promise<ICompany> {
    const newCompany = new Company(company); 
    return await newCompany.save(); 
  }
}

export default new SuperAdminRepository();
