import { Request, Response } from 'express';
import ISuperAdminController from '../interface/ISuperAdminController';
import { inject, injectable } from 'inversify';
import ISuperAdminService from '../../service/interface/ISuperAdminService';


@injectable()
export default class SuperAdminController implements ISuperAdminController {

  private superAdminService: ISuperAdminService;
  constructor(@inject("ISuperAdminService") superAdminService: ISuperAdminService) {
    this.superAdminService = superAdminService;
  }


  async getAllCompanies(req: Request, res: Response) :Promise<Response> {
  
    try {
      const companies = await this.superAdminService.getAllCompanies();
      return res.status(200).json(companies); 
    } catch (error) {
      console.error('Error fetching companies in controller:', error);
      return res.status(500).json({ message: 'Server error. Unable to fetch companies.' });
    }
  }
}


