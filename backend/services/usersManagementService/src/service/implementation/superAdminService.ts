import superAdminRepositery from "../../repository/implementation/superAdminRepository";
import bcrypt from "bcryptjs";


class SuperAdminService {
    async getAllCompanies() {
      try {
        const companies = await superAdminRepositery.getAllCompanies();
        return companies; // Return the companies data
      } catch (error) {
        console.error('Error fetching companies in service:', error);
        throw new Error('Unable to fetch companies.'); // Throw an error for the controller to handle
      }
    }   
  }
  
  export default new SuperAdminService();