import { Request, Response } from "express";
import ISuperAdminService from "../../service/interface/ISuperAdminService";  
import { inject, injectable } from "inversify";
import ISuperAdminController from "../../controllers/interface/ISuperAdminController";

@injectable()
export default class SuperAdminController implements ISuperAdminController {
  

  constructor(@inject("ISuperAdminService") private _superAdminService: ISuperAdminService) {} 

  async setNewAccessToken(req: Request, res: Response): Promise<Response> {
    
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.status(400).json({ message: 'Refresh token missing.' });

      const newAccessToken = await this._superAdminService.setNewAccessToken(refreshToken);
      if (!newAccessToken) return res.status(401).json({ message: 'Failed to generate new access token.' });

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
        sameSite: 'strict',
      });

      return res.status(200).json({ accessToken: newAccessToken });

    } catch {
      return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    try {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ error: 'Logout failed' });
    }
  }

  async getAllServiceRequest(req: Request, res: Response): Promise<Response> {
    
    try {
      const  serviceRequests = await this._superAdminService.getAllServiceRequest();
      console.log("serviceRequests",serviceRequests);
      
      return res.status(200).json({ serviceRequests });
    } catch (error) {
      console.error('Error fetching super admins:', error);
      return res.status(500).json({ error: 'Failed to fetch super admins' });
    }
  }

  async updateServiceRequestStatus(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const updatedServiceRequest = await this._superAdminService.updateServiceRequestStatus(id, status);
      return res.status(200).json({ updatedServiceRequest });
    } catch (error) {
      console.error('Error updating service request status:', error);
      return res.status(500).json({ error: 'Failed to update service request status' });
    }
  }
}
