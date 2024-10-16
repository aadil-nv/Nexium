import { Request, Response } from 'express';
import superAdminService from '../../Service/implementation/superAdminService';

class SuperAdminController {
  async getAllCompanies(req: Request, res: Response) {
    console.log('Fetching companies...');
    
    try {
      // Call the service to get all companies and pass the response object
      const companies = await superAdminService.getAllCompanies(); // This should return the data directly
      return res.status(200).json(companies); // Send the companies in the response
    } catch (error) {
      console.error('Error fetching companies in controller:', error);
      return res.status(500).json({ message: 'Server error. Unable to fetch companies.' });
    }
  }
}

export default new SuperAdminController();
