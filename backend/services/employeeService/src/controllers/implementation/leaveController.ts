import ILeaveController from "../interface/ILeaveController";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/tokenAuth";
import ILeaveService from "../../service/interface/ILeaveService";
import { HttpStatusCode } from "../../utils/enums";
import { inject, injectable } from "inversify";


@injectable()
export default class LeaveController implements ILeaveController {
    constructor(@inject("ILeaveService") private _leaveService: ILeaveService) { }

    private getBusinessOwnerId(req: CustomRequest): string {
        return req.user?.employeeData?.businessOwnerId || '';
    }

    async applyLeave(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            const data = req.body
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const leaves = await this._leaveService.applyLeave(employeeId, data, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(leaves);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async fetchAppliedLeaves(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const leaves = await this._leaveService.fetchAppliedLeaves(employeeId as string, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(leaves);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }

    }

    async updateAppliedLeave(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            const leaveId = req.params.id;
            const leaveData = req.body
            const businessOwnerId = this.getBusinessOwnerId(req);
            const leaves = await this._leaveService.updateAppliedLeave(employeeId as string, leaveId as string, leaveData, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(leaves);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async deleteAppliedLeave(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            const leaveId = req.params.id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const leaves = await this._leaveService.deleteAppliedLeave(employeeId as string, leaveId as string, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(leaves);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
}
