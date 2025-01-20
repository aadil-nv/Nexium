import { injectable, inject } from "inversify"; 
import { Request, Response } from "express";
import IEmployeeService from "../../service/interface/IEmployeeService";
import { CustomRequest } from "../../middlewares/tokenAuth";
import { HttpStatusCode } from "../../utils/enums";
import connectDB from "../../config/connectDB";
import { log } from "console";

@injectable()
export default class EmployeeController {
    constructor(@inject("IEmployeeService") private _employeeService: IEmployeeService) {}

    async setNewAccessToken(req: Request, res: Response): Promise<Response> {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "No token provided" });

            const result = await this._employeeService.setNewAccessToken(refreshToken);
            if (!result.accessToken) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Failed to generate token' });

            res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000, sameSite: 'strict' });
            await connectDB(result.businessOwnerId);

            return res.status(HttpStatusCode.OK).json({ message: "Token set successfully", success: result.success });
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async logout(req: Request, res: Response): Promise<Response> {
        try {
            res.clearCookie('refreshToken').clearCookie('accessToken');
            return res.status(HttpStatusCode.OK).json({ message: 'Logged out successfully' });
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to logout' });
        }
    }

    async getProfile(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "No token provided" });

            const employee = await this._employeeService.getProfile(employeeId);
            return res.status(HttpStatusCode.OK).json(employee);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async getPersonalInfo(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "No token provided" });

            const employee = await this._employeeService.getPersonalInfo(employeeId);
            return res.status(HttpStatusCode.OK).json(employee);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async updateProfile(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const employee = await this._employeeService.updateProfile( employeeId,req.body);
            return res.status(HttpStatusCode.OK).json(employee);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async updateProfilePicture(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const employee = await this._employeeService.updateProfilePicture(employeeId, req.file as Express.Multer.File);
            return res.status(HttpStatusCode.OK).json(employee);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async getAddress(req: CustomRequest, res: Response): Promise<Response> {
      console.log("hitting get address ===============**********==================");
      
        try {
            const employeeId = req.user?.employeeData?._id;
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const employee = await this._employeeService.getAddress(employeeId);
            console.log("employee",employee);
            
            return res.status(HttpStatusCode.OK).json(employee);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async updateAddress(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const employee = await this._employeeService.updateAddress(employeeId, req.body);
            return res.status(HttpStatusCode.OK).json(employee);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
    async getEmployeeProfessionalInfo(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const employee = await this._employeeService.getEmployeeProfessionalInfo(employeeId);
            return res.status(HttpStatusCode.OK).json(employee);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

   async getDocuments(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const employee = await this._employeeService.getDocuments(employeeId);
            return res.status(HttpStatusCode.OK).json(employee);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
   } 

   async updateDocuments(req: CustomRequest, res: Response): Promise<Response> {
    try {
        const employeeId = req?.user?.employeeData?._id;
    
        if(!employeeId){
          return res.status(400).json({ message: "Business owner ID not provided in cookies" });
        }
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
    
        const result = await this._employeeService.uploadDocuments(employeeId, req.file, "resume");
    
        if(!result){
          return res.status(400).json({ message: "Failed to upload documents" });
        }
        return res.status(200).json(result);
        
      
      } catch (error) {
        return res.status(500).json({
          message: "Failed to get manager personal info",
          error,
        });
      }
   }

   async getEmployeeCredentials(req: CustomRequest, res: Response): Promise<Response> {
    console.log("hitting get employee credentials ===============**********==================");
    
    try {
        const employeeId = req.user?.employeeData?._id;
        if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
        const employee = await this._employeeService.getEmployeeCredentials(employeeId);

        console.log("employee credde    wwwwwwwwwwwwwwww",employee);
        
        return res.status(HttpStatusCode.OK).json(employee);
    } catch (error) {
        console.error(error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
   }
}
