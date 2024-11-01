import ISuperAdminRepository from "../interface/ISuperAdminRepository";
import Company from "../../models/businessOwnerModel"; 
import { ICompany } from "../interface/ISuperAdminRepository";
import { injectable } from "inversify";


@injectable()
export default class SuperAdminRepository implements ISuperAdminRepository {

  async getAllCompanies(): Promise<any> {
    return await Company.find(); 
  }
}


