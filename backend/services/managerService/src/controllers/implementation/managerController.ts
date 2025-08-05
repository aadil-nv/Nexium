import { Request, Response } from "express";
import IManagerService from "../../service/interface/IManagerService";
import IManagerController from "../interface/IManagerController";
import { inject, injectable } from "inversify";
import { CustomRequest } from '../../middlewares/tokenAuthenticate'
import { HttpStatusCode } from "./../../utils/enums";

@injectable()
export default class ManagerController implements IManagerController {
  constructor(
    @inject("IManagerService") private _managerService: IManagerService
  ) { }

  async getManagers(req: CustomRequest, res: Response): Promise<Response> {


    try {
      const businessOwnerId = req?.user?.managerData?.businessOwnerId;
      const managers = await this._managerService.getManagers(businessOwnerId as string);
      return res.status(200).json(managers);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get managers", error });
    }
  }

  async getManagerPersonalInfo(req: CustomRequest, res: Response): Promise<Response> {

    try {
      const businessOwnerId = req?.user?.managerData?.businessOwnerId;
      const managerId = req?.user?.managerData?._id;
      if (!managerId) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "Business owner ID not provided in cookies" });
      }

      const managerpersonalinfo = await this._managerService.getManagerPersonalInfo(managerId, businessOwnerId as string);

      return res.status(HttpStatusCode.OK).json(managerpersonalinfo);

    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to get manager personal info", error });


    }
  }

  async getManagerProfessionalInfo(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = req?.user?.managerData?.businessOwnerId;

      const managerId = req?.user?.managerData?._id;
      if (!managerId) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "Business owner ID not provided in cookies" });
      }

      const managerProfessionalInfo = await this._managerService.getManagerProfessionalInfo(managerId, businessOwnerId as string);
      return res.status(HttpStatusCode.OK).json(managerProfessionalInfo);

    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to get manager personal info", error });


    }
  }

  async getManagerAddress(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = req?.user?.managerData?.businessOwnerId;
      const managerId = req?.user?.managerData?._id;
      if (!managerId) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "Business owner ID not provided in cookies" });
      }


      const managerAddress = await this._managerService.getManagerAddress(managerId, businessOwnerId as string);

      return res.status(HttpStatusCode.OK).json(managerAddress);

    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to get manager personal info", error });


    }
  }

  async getManagerDocuments(req: CustomRequest, res: Response): Promise<Response> {

    try {
      const businessOwnerId = req?.user?.managerData?.businessOwnerId;

      const managerId = req?.user?.managerData?._id;
      if (!managerId) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "Business owner ID not provided in cookies" });
      }

      const managerDocuments = await this._managerService.getManagerDocuments(managerId, businessOwnerId as string);

      return res.status(HttpStatusCode.OK).json(managerDocuments);

    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to get manager personal info", error });


    }
  }

  async getManagerCredentials(req: CustomRequest, res: Response): Promise<Response> {


    try {
      const businessOwnerId = req?.user?.managerData?.businessOwnerId;

      const managerId = req?.user?.managerData?._id;
      if (!managerId) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "Business owner ID not provided in cookies" });
      }
      const managerCredentials = await this._managerService.getManagerCredentials(managerId, businessOwnerId as string);
      console.log("managerCredentials", managerCredentials);

      return res.status(HttpStatusCode.OK).json(managerCredentials);

    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to get manager personal info", error });


    }
  }

  async updateManagerPersonalInfo(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = req?.user?.managerData?.businessOwnerId;

      const managerId = req?.user?.managerData?._id;
      if (!managerId) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "Business owner ID not provided in cookies" });
      }


      const result = await this._managerService.updateManagerPersonalInfo(managerId, req.body, businessOwnerId as string);

      return res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Failed to get manager personal info",
        error,
      });
    }
  }


  async setNewAccessToken(req: CustomRequest, res: Response): Promise<Response> {

    try {

      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        console.error("Refresh token is missing from cookies.");
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Refresh token missing.' });
      }

      const newAccessToken = await this._managerService.setNewAccessToken(refreshToken);

      if (!newAccessToken) {
        console.error("Failed to generate a new access token.");
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Failed to generate new access token.' });
      }



      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: Number(process.env.MAX_AGE),
        sameSite: 'strict',
      });

      return res.status(HttpStatusCode.OK).json({ accessToken: newAccessToken });
    } catch (error) {
      console.error("Error in setNewAccessToken:", error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to generate new access token.' });
    }
  }

  async logout(req: CustomRequest, res: Response): Promise<Response> {

    try {
      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');
      return res.status(HttpStatusCode.OK).json({ message: 'Logged out successfully.' });
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to logout.' });
    }
  }


  async updateManagerProfilePicture(req: CustomRequest, res: Response): Promise<Response> {

    try {
      const managerId = req?.user?.managerData?._id;
      const businessOwnerId = req?.user?.managerData?.businessOwnerId;
      if (!managerId) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "Business owner ID not provided in cookies" });

      }

      const result = await this._managerService.updateManagerProfilePicture(managerId, req.file as Express.Multer.File, businessOwnerId as string);
      return res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Failed to get manager personal info",
        error,
      });
    }
  }

  async getLeaveEmployees(req: CustomRequest, res: Response): Promise<Response> {


    try {
      const businessOwnerId = req?.user?.managerData?.businessOwnerId;

      const managerId = req?.user?.managerData?._id;
      if (!managerId) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "Business owner ID not provided in cookies" });
      }
      const result = await this._managerService.getLeaveEmployees(managerId, businessOwnerId as string);
      return res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Failed to get manager personal info",
        error,
      });
    }
  }

  async updateManagerAddress(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = req?.user?.managerData?.businessOwnerId;

      const managerId = req?.user?.managerData?._id;
      if (!managerId) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "Business owner ID not provided in cookies" });
      }
      const result = await this._managerService.updateManagerAddress(managerId, req.body, businessOwnerId as string);
      return res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Failed to get manager personal info",
        error,
      });
    }
  }

  async updateDocuments(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const managerrId = req?.user?.managerData?._id;
      const businessOwnerId = req?.user?.managerData?.businessOwnerId;

      if (!managerrId) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Business owner ID not provided in cookies" });
      }
      if (!req.file) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "No file uploaded" });
      }

      const result = await this._managerService.uploadDocuments(managerrId, req.file, "resume", businessOwnerId as string);

      if (!result) {
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to upload documents" });
      }
      return res.status(HttpStatusCode.OK).json(result);


    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Failed to get manager personal info",
        error,
      });
    }
  }

  async updateManagerIsActive(req: CustomRequest, res: Response): Promise<Response> {


    try {
      const businessOwnerId = req?.user?.managerData?.businessOwnerId;

      const managerId = req?.user?.managerData?._id;
      if (!managerId) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "Business owner ID not provided in cookies" });
      }
      const result = await this._managerService.updateManagerIsActive(managerId, false, businessOwnerId as string);
      return res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Failed to get manager personal info",
        error,
      });
    }
  }

}
