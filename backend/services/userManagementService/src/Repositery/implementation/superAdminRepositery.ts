import ISuperAdminRepository from "../interface/ISuperAdminRepositery";
import Company from "../../Schemas/businessOwnerSchema"; 
import { ICompany } from "../interface/ISuperAdminRepositery";

class SuperAdminRepository implements ISuperAdminRepository {
  // Method to fetch all companies from the database
  async getAllCompanies(): Promise<ICompany[]> {
    return await Company.find(); // Adjust based on your actual model and ORM
  }

  // Method to fetch a company by its ID
  async getCompanyById(id: string): Promise<ICompany | null> {
    return await Company.findById(id); // Fetch company by ID
  }

  // Method to create a new company
  async createCompany(company: ICompany): Promise<ICompany> {
    const newCompany = new Company(company); // Create a new instance of the Company model
    return await newCompany.save(); // Save the new company to the database
  }
}

export default new SuperAdminRepository();
