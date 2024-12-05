import { Request, Response } from "express";
import IManagerService from "../../service/interface/IManagerService";
import IManagerController from "../interface/IManagerController";
import { inject, injectable } from "inversify";
import { CustomRequest } from '../../middlewares/tokenAuthenticate'

@injectable()
export default class ManagerController implements IManagerController {
  constructor(
    @inject("IManagerService") private _managerService: IManagerService
  ) {}

  async getManagers(req: Request, res: Response): Promise<Response> {
    try {
      const managers = await this._managerService.getManagers();
      return res.status(200).json(managers);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get managers", error });
    }
  }

  async getManagerPersonalInfo(req: CustomRequest, res: Response): Promise<Response> {

    try {
      const managerId = req?.user?.managerData?._id;
       if (!managerId) {
         return res
           .status(400)
           .json({ message: "Business owner ID not provided in cookies" });
       }

      const managerpersonalinfo = await this._managerService.getManagerPersonalInfo(managerId);

      return res.status(200).json(managerpersonalinfo);
      
    } catch (error) {
      return res.status(500).json({ message: "Failed to get manager personal info", error });

      
    }
  }

  async getManagerProfessionalInfo(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const managerId = req?.user?.managerData?._id;
      if (!managerId) {
        return res
          .status(400)
          .json({ message: "Business owner ID not provided in cookies" });
      }

      const managerProfessionalInfo = await this._managerService.getManagerProfessionalInfo(managerId);
      return res.status(200).json(managerProfessionalInfo);
      
    } catch (error) {
      return res.status(500).json({ message: "Failed to get manager personal info", error });

      
    }
  }

  async getManagerAddress(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const managerId = req?.user?.managerData?._id;
       if (!managerId) {
         return res
           .status(400)
           .json({ message: "Business owner ID not provided in cookies" });
       }


      const managerAddress = await this._managerService.getManagerAddress(managerId);
        
      return res.status(200).json(managerAddress);
      
    } catch (error) {
      return res.status(500).json({ message: "Failed to get manager personal info", error });

      
    }
  }

  async getManagerDocuments(req: CustomRequest, res: Response): Promise<Response> {

    try {
      const managerId = req?.user?.managerData?._id;
       if (!managerId) {
         return res
           .status(400)
           .json({ message: "Business owner ID not provided in cookies" });
       }

      const managerDocuments = await this._managerService.getManagerDocuments(managerId);
      return res.status(200).json(managerDocuments);
      
    } catch (error) {
      return res.status(500).json({ message: "Failed to get manager personal info", error });

      
    }
  }

  async getManagerCredentials(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const managerId = req?.user?.managerData?._id;
       if (!managerId) {
         return res
           .status(400)
           .json({ message: "Business owner ID not provided in cookies" });
       }
      const managerCredentials = await this._managerService.getManagerCredentials(managerId);
      return res.status(200).json(managerCredentials);
      
    } catch (error) {
      return res.status(500).json({ message: "Failed to get manager personal info", error });

      
    }
  }

  async updateManagerPersonalInfo(req: CustomRequest, res: Response): Promise<Response> {
    console.log("hitting manager update personal info==================");
    
    try {

      const managerId = req?.user?.managerData?._id;
      if (!managerId) {
        return res
          .status(400)
          .json({ message: "Business owner ID not provided in cookies" });
      }

     
        const result = await this._managerService.updateManagerPersonalInfo(managerId, req.body);

        console.log("result======from ========update", result);
        

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get manager personal info",
            error,
        });
    }
}

  
  async setNewAccessToken(req: Request, res: Response): Promise<Response> {
  console.log("hitted setNewAccessToken-----------------------------------");
  
  console.log("Cookies received in request:", req.cookies); // Log all cookies
  
  const refreshToken = req.cookies?.refreshToken; // Use optional chaining
  
  console.log(`Extracted refresh token: ${refreshToken}`);
  
  try {
    if (!refreshToken) {
      console.error("Refresh token is missing from cookies.");
      return res.status(400).json({ message: 'Refresh token missing.' });
    } 

    const newAccessToken = await this._managerService.setNewAccessToken(refreshToken);
    
    if (!newAccessToken) {
      console.error("Failed to generate a new access token.");
      return res.status(401).json({ message: 'Failed to generate new access token.' });
    }

    console.log(`Generated new access token: ${newAccessToken}`);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
      sameSite: 'strict',
    });

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error in setNewAccessToken:", error);
    return res.status(500).json({ error: 'Failed to generate new access token.' });
  }
}

  async logout(req: Request, res: Response): Promise<Response> {
  console.log("hitted logout-----------------------------------");
  
  try {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to logout.' });
  }
}


 async updateManagerProfilePicture(req: CustomRequest, res: Response): Promise<Response> {

  console.log(`"***************************************** htted updateManagerProfilePicture"`.bgRed);
  
    try {
      const managerId = req?.user?.managerData?._id;
      if (!managerId) {
        return res
          .status(400)
          .json({ message: "Business owner ID not provided in cookies" });
      }
      const result = await this._managerService.updateManagerProfilePicture(managerId, req.file as Express.Multer.File);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to get manager personal info",
        error,
      });
    }
  }

 async getLeaveEmployees(req: CustomRequest, res: Response): Promise<Response> {

  console.log(`"***************************************** htted getLeaveEmployees"`.bgRed);
  
    try {
      const managerId = req?.user?.managerData?._id;
      if (!managerId) {
        return res
          .status(400)
          .json({ message: "Business owner ID not provided in cookies" });
      }
      const result = await this._managerService.getLeaveEmployees(managerId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to get manager personal info",
        error,
      });
    }
  }
  
}
