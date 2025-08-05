import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import IEmployeeService from "../../service/interface/IEmployeeService";
import { CustomRequest } from "../../middlewares/tokenAuth";
import { HttpStatusCode } from "../../utils/enums";
import connectDB from "../../config/connectDB";
import { log } from "console";

@injectable()
export default class EmployeeController {
    constructor(@inject("IEmployeeService") private _employeeService: IEmployeeService) { }
    private getBusinessOwnerId(req: CustomRequest): string {
        return req.user?.employeeData?.businessOwnerId || '';
    }
    async setNewAccessToken(req: Request, res: Response): Promise<Response> {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "No token provided" });

            const result = await this._employeeService.setNewAccessToken(refreshToken);
            if (!result.accessToken) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Failed to generate token' });

            res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: Number(process.env.MAX_AGE), sameSite: 'strict' });
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

    async updateIsActive(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const employee = await this._employeeService.updateIsActive(employeeId, false, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(employee);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async getProfile(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "No token provided" });
            const businessOwnerId = this.getBusinessOwnerId(req);
            const employee = await this._employeeService.getProfile(employeeId, businessOwnerId);
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
            const businessOwnerId = this.getBusinessOwnerId(req);
            const employee = await this._employeeService.getPersonalInfo(employeeId, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(employee);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async updateProfile(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const employee = await this._employeeService.updateProfile(employeeId, req.body, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(employee);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async updateProfilePicture(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const employee = await this._employeeService.updateProfilePicture(employeeId, req.file as Express.Multer.File, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(employee);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async getAddress(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const employee = await this._employeeService.getAddress(employeeId, this.getBusinessOwnerId(req));
            return res.status(HttpStatusCode.OK).json(employee);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async updateAddress(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const employee = await this._employeeService.updateAddress(employeeId, req.body, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(employee);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
    async getEmployeeProfessionalInfo(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const employee = await this._employeeService.getEmployeeProfessionalInfo(employeeId, businessOwnerId);;
            return res.status(HttpStatusCode.OK).json(employee);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async getDocuments(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const employee = await this._employeeService.getDocuments(employeeId, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(employee);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async updateDocuments(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req?.user?.employeeData?._id;
            const businessOwnerId = this.getBusinessOwnerId(req);

            if (!employeeId) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Business owner ID not provided in cookies" });
            }
            if (!req.file) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "No file uploaded" });
            }

            const result = await this._employeeService.uploadDocuments(employeeId, req.file, "resume", businessOwnerId);

            if (!result) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Failed to upload documents" });
            }
            return res.status(HttpStatusCode.OK).json(result);


        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: "Failed to get manager personal info",
                error,
            });
        }
    }

    async getEmployeeCredentials(req: CustomRequest, res: Response): Promise<Response> {

        try {
            const employeeId = req.user?.employeeData?._id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const employee = await this._employeeService.getEmployeeCredentials(employeeId, businessOwnerId);

            return res.status(HttpStatusCode.OK).json(employee);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
}
