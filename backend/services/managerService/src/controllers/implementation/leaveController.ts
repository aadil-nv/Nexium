import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import ILeaveController from "../interface/ILeaveController";
import { CustomRequest } from "../../middlewares/tokenAuthenticate";
import ILeaveService from "../../service/interface/ILeaveService";




@injectable()
export default class LeaveController implements ILeaveController {
    constructor(@inject ("ILeaveService") private _leaveService: ILeaveService) {}

    async updateLeaveApproval(req: CustomRequest, res: Response): Promise<void> {
        console.log(`update leave approval controleris ======`.bgYellow);
        console.log("req.body", req.body);
        
        
       try {
        const employeeId = req.params.id;
        console.log("employeeId--------------------------", employeeId);
        
        const leaveId = req.params.leaveId;
        console.log("leaveId--------------------------", leaveId);
        const leaveStatus = req.body.leaveStatus;
        console.log("leaveStatus--------------------------", leaveStatus);
        const result = await this._leaveService.updateLeaveApproval(employeeId, leaveId, leaveStatus);
        res.status(200).json(result);
        
       } catch (error) {
        console.error("Error updating leave approval:", error);
        res.status(500).json({ message: "Failed to update leave approval", error });
        
       }
    }

    async getAllLeaveEmployees(req: CustomRequest, res: Response): Promise<void> {
        console.log(`get all leave employees controleris ======`.bgYellow);
        
        try {
            const result = await this._leaveService.getAllLeaveEmployees();
            console.log("result", result);
            
            res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching leave employees:", error);
            res.status(500).json({ message: "Failed to fetch leave employees", error });
        }
    }
}