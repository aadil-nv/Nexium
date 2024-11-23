import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import IBusinessOwnerController from "../interface/IBusinessOwnerController";
import IBusinessOwnerService from "../../service/interface/IBusinessOwnerService";

@injectable()
export default class BusinessOwnerController implements IBusinessOwnerController {
  private _businessOwnerService: IBusinessOwnerService;

  constructor(@inject("IBusinessOwnerService") businessOwnerService: IBusinessOwnerService) {
    this._businessOwnerService = businessOwnerService;
  }

  async setNewAccessToken(req: Request, res: Response): Promise<Response> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.status(400).json({ message: 'Refresh token missing.' });

      const newAccessToken = await this._businessOwnerService.setNewAccessToken(refreshToken);
      if (!newAccessToken) return res.status(401).json({ message: 'Failed to generate new access token.' });

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
        sameSite: 'strict',
      });

      return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to generate new access token.' });
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    try {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      return res.status(500).json({ error: 'Logout failed' });
    }
  }

  async getPersonalDetails(req: Request, res: Response): Promise<Response> {
    try {
      const refreshToken = req.cookies.refreshToken;
  
      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token not provided" });
      }
  
      const result = await this._businessOwnerService.getPersonalDetails(refreshToken);
  
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in getPersonalDetails:", error);
      return res.status(500).json({ success: false, message: "Failed to retrieve personal details" });
    }
  }

  async getCompanyDetails(req: Request, res: Response): Promise<Response> {
   try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token not provided" });
    }

    const result = await this._businessOwnerService.getCompanyDetails(refreshToken);

    return res.status(200).json({ success: true, data: result });
    
   } catch (error) {
    console.error("Error in getCompanyDetails:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve company details" });
   }
  }

  async getAddress(req: Request, res: Response): Promise<Response> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token not provided" });
      }

      const result = await this._businessOwnerService.getAddress(refreshToken);
      return res.status(200).json({ success: true, data: result });

    } catch (error) {
      console.error("Error in getAddress:", error);
      return res.status(500).json({ success: false, message: "Failed to retrieve address" });
    }

  }

  async getDocuments(req: Request, res: Response): Promise<Response> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token not provided" });
      }

      const result = await this._businessOwnerService.getDocuments(refreshToken);

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in getDocuments:", error);
      return res.status(500).json({ success: false, message: "Failed to retrieve documents" });
    }
  }

  async updatePersonalDetails(req: Request, res: Response): Promise<Response> {
  console.log("Received request body:", req.body);
  console.log("<>+++++++++++++++++++++++++++++++++++++++++++++");
  try {
    const refreshToken = req.cookies.refreshToken;
    const data =req.body
    console.log("Data received:", data);
    
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token not provided" });
    }

    const result = await this._businessOwnerService.updatePersonalDetails(refreshToken, data);
    console.log("Result:=================================>", result);
    
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error in updatePersonalDetails:", error);
    return res.status(500).json({ success: false, message: "Failed to update personal details" });
  }
  }
  

  async uploadImages(req: Request, res: Response): Promise<Response> {
    try {
      const refreshToken = req.cookies.refreshToken;
  
      if (!refreshToken) {
        console.error('No refresh token provided');
        return res.status(400).json({ message: 'Refresh token not provided' });
      }
  
      // Log the file information
      console.log('Uploaded file:', req.file);
  
      if (!req.file) {
        console.error('File is missing in request');
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      // Call the service to upload the file to S3
      const result = await this._businessOwnerService.uploadImages(
        refreshToken,
        req.file // Pass the file object
      );
  
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error('Error in uploadImages:', error);
      return res.status(500).json({ success: false, message: 'Failed to upload image' });
    }
  }
  

  
}
