import { Request, Response } from "express";
import IAttendanceService from "../../service/interface/IAttendanceService";
import IAttendanceController from "../../controllers/interface/IAttendanceController";
import { inject, injectable } from "inversify";
import { CustomRequest } from "../../middlewares/tokenAuth";
import { HttpStatusCode } from "../../utils/enums";

@injectable()
export default class AttendanceController implements IAttendanceController {
    constructor(@inject("IAttendanceService") private attendanceService: IAttendanceService) { }

    private handleError(res: Response, error: any): Response {
        console.error(error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
    private getEmployeeId(req: CustomRequest): string | null {
        return req.user?.employeeData?._id || null;
    }
    private getBusinessOwnerId(req: CustomRequest): string {
        return req.user?.employeeData?.businessOwnerId || '';
    }

    async fetchAttendance(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = this.getEmployeeId(req);
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "No token provided" });
            const attendances = await this.attendanceService.fetchAttendances(employeeId, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(attendances);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async markCheckin(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = this.getEmployeeId(req);
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const attendance = await this.attendanceService.markCheckin(req.body, employeeId, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(attendance);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async markCheckout(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = this.getEmployeeId(req);
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const attendance = await this.attendanceService.markCheckout(req.body, employeeId, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(attendance);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async fetchApprovedLeaves(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = this.getEmployeeId(req);
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const leaves = await this.attendanceService.fetchApprovedLeaves(employeeId, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(leaves);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async applyLeave(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = this.getEmployeeId(req);
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const leaves = await this.attendanceService.applyLeave(req.body, employeeId, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(leaves);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async updateAttendanceEntry(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = this.getEmployeeId(req);
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const leaves = await this.attendanceService.updateAttendanceEntry(employeeId, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(leaves);
        } catch (error) {
            return this.handleError(res, error);
        }
    }
}
