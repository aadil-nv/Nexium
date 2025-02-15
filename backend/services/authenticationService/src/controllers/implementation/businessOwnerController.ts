import { NextFunction, Request, Response } from "express";
import IBusinessOwnerController from "../interface/IBusinessOwnerController";
import IBusinessOwnerService from "../../service/interfaces/IBusinessOwnerService";
import { inject, injectable } from "inversify";
import { HttpStatusCode } from "../../utils/enums";

@injectable()
export default class BusinessOwnerController implements IBusinessOwnerController {
  private _businessOwnerService: IBusinessOwnerService;

  constructor(
    @inject("IBusinessOwnerService") businessOwnerService: IBusinessOwnerService
  ) {
    this._businessOwnerService = businessOwnerService;
  }

  async login(req: Request, res: Response): Promise<Response> {
    console.log("req.body is ==>",req.body);
  
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Email and password are required" });
      const { success, message, accessToken, refreshToken, isVerified, email: companyEmail,companyName ,companyLogo } =
        await this._businessOwnerService.login(email, password);        

      if (!success) {
        if (!isVerified) {
          return res.status(HttpStatusCode.BAD_REQUEST).json({ message: message, email: companyEmail, isVerified: false, success: false });
        }
      }
    

      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict',
         maxAge:7 * 24 * 60 * 60 * 1000 });
      res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict',
         maxAge:7 * 24 * 60 * 60 * 1000 });
         

      return res.status(HttpStatusCode.OK).json({ accessToken, success, message,companyName:companyName ,companyLogo:companyLogo });
    } catch (error) {
      console.error("Error during login", error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "An error occurred during login" });
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { companyName, email, password, phone } = req.body;
      const businessOwnerData = { companyName, email, password, phone };
      const { success, message, email: registeredEmail  } = await this._businessOwnerService.register(businessOwnerData);
      res.status(HttpStatusCode.CREATED).json({ message, email: registeredEmail, success });
    } catch (error) {
      console.error("Error during registration:", error);
      next(error);
    }
  }

  async validateOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp } = req.body;
      const response = await this._businessOwnerService.validateOtp(email, otp);
      res.status(HttpStatusCode.OK).json({ success: response.success, email: response.email });
    } catch (error) {
      console.error("Error validating OTP:", error);
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;
      const result = await this._businessOwnerService.resendOtp(email);
      return res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      console.error('Error resending OTP:', error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  }


  async forgotPassword(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;
      const result = await this._businessOwnerService.forgotPassword(email);
      return res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      console.error('Error during forgot password:', error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  }

  async addNewPassword(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const result = await this._businessOwnerService.addNewPassword(email, password);
    return res.status(HttpStatusCode.OK).json(result);
  }

  async googleLogin(req: Request, res: Response): Promise<Response> {
    try {
        const { email, password, phone, companyName } = req.body;
        if (!email || !companyName) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Email and company name are required" });
        }

        const { success, message, accessToken, refreshToken, isVerified, email: companyEmail, companyName: registeredCompanyName, companyLogo } =
            await this._businessOwnerService.googleLogin(email, password, phone, companyName);

        if (!success) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message, email: companyEmail, isVerified, success: false });
        }

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(HttpStatusCode.OK).json({
            success,
            message,
            accessToken,
            companyName: registeredCompanyName,
            companyLogo
        });
    } catch (error) {
        console.error("Error during Google login:", error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}

}
