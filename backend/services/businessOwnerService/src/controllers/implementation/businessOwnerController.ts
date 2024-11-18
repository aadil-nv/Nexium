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
}
