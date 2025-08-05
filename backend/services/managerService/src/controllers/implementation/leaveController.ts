import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import ILeaveController from "../interface/ILeaveController";
import { CustomRequest } from "../../middlewares/tokenAuthenticate";
import ILeaveService from "../../service/interface/ILeaveService";
import { log } from "util";
import { HttpStatusCode } from "./../../utils/enums";




@injectable()
export default class LeaveController implements ILeaveController {
    constructor(@inject("ILeaveService") private _leaveService: ILeaveService) { }

    async updateLeaveApproval(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.params.id;
            const data = req.body;
            const businessOwnerId = req.user?.managerData?.businessOwnerId

            const result = await this._leaveService.updateLeaveApproval(employeeId, data, businessOwnerId as string);

            if (result.success) {
                return res.status(HttpStatusCode.OK).json({
                    message: result.message,
                    leaveStatus: result.leaveStatus,
                    success: true
                });
            } else {
                return res.status(HttpStatusCode.BAD_REQUEST).json({
                    message: result.message,
                    success: false
                });
            }
        } catch (error: any) {
            console.error("Error updating leave approval:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: "Failed to update leave approval",
                error: error.message,
                success: false
            });
        }
    }


    async getAllLeaveEmployees(req: CustomRequest, res: Response): Promise<void> {

        try {
            const businessOwnerId = req.user?.managerData?.businessOwnerId
            const result = await this._leaveService.getAllLeaveEmployees(businessOwnerId as string);
            res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            console.error("Error fetching leave employees:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch leave employees", error });
        }
    }



    async getAllLeaveTypes(req: CustomRequest, res: Response): Promise<Response> {

        try {
            const businessOwnerId = req.user?.managerData?.businessOwnerId
            const result = await this._leaveService.getAllLeaveTypes(businessOwnerId as string);
            return res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            console.error("Error fetching leave types:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch leave types", error });
        }
    }

    async updateLeaveTypes(req: CustomRequest, res: Response): Promise<Response> {

        try {
            const leaveTypeId = req.params.id;
            const businessOwnerId = req.user?.managerData?.businessOwnerId
            const data = req.body;

            const result = await this._leaveService.updateLeaveTypes(leaveTypeId, data, businessOwnerId as string);
            return res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            console.error("Error updating leave types:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to update leave types", error });
        }
    }

    async fetchAllPreAppliedLeaves(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const businessOwnerId = req.user?.managerData?.businessOwnerId
            const result = await this._leaveService.fetchAllPreAppliedLeaves(businessOwnerId as string);
            return res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            console.error("Error fetch All PreAppliedLeaves  :", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch leave types", error });
        }
    }

    async updatePreAppliedLeaves(req: CustomRequest, res: Response): Promise<Response> {

        try {
            const data = req.body
            const employeeId = req.params.id
            const managerId = req.user?.managerData?._id
            const businessOwnerId = req.user?.managerData?.businessOwnerId
            const response = await this._leaveService.updatePreAppliedLeaves(employeeId, managerId as string, data, businessOwnerId as string);
            return res.status(HttpStatusCode.OK).json(response);

        } catch (error) {
            console.error("Error fetch All PreAppliedLeaves  :", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to update pre applied lave", error });
        }
    }

}