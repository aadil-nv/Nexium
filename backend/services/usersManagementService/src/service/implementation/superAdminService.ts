import { inject, injectable } from "inversify";
import superAdminRepositery from "../../repository/implementation/superAdminRepository";
import ISuperAdminService from "../interface/ISuperAdminService";
import ISuperAdminRepository from "../../repository/interface/ISuperAdminRepository";


@injectable()
export default class SuperAdminService implements ISuperAdminService {

  private superAdminRepositery: ISuperAdminRepository;

  constructor(@inject("ISuperAdminRepository") superAdminRepositery: ISuperAdminRepository) {
    this.superAdminRepositery = superAdminRepositery;
  }
    async getAllCompanies(): Promise<any> {
      try {
        const companies = await this.superAdminRepositery.getAllCompanies();
        return companies; 
      } catch (error) {
        console.error('Error fetching companies in service:', error);
        throw new Error('Unable to fetch companies.'); 
      }
    }   
  }
  
 