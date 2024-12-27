import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import ILeaveController from "../interface/ILeaveController";
import { CustomRequest } from "../../middlewares/tokenAuthenticate";
import ILeaveService from "../../service/interface/ILeaveService";




@injectable()
export default class LeaveController implements ILeaveController {
    constructor(@inject ("ILeaveService") private _leaveService: ILeaveService) {}

    async updateLeaveApproval(req: CustomRequest, res: Response): Promise<void> {
        try {
            const employeeId = req.params.id;
       
            const data = req.body
     
        
        const result = await this._leaveService.updateLeaveApproval(employeeId ,data);
        
        res.status(200).json(result);
        
       } catch (error) {
        console.error("Error updating leave approval:", error);
        res.status(500).json({ message: "Failed to update leave approval", error });
        
       }
    }

    async getAllLeaveEmployees(req: CustomRequest, res: Response): Promise<void> {

        
        try {
            const result = await this._leaveService.getAllLeaveEmployees();
         
            
            res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching leave employees:", error);
            res.status(500).json({ message: "Failed to fetch leave employees", error });
        }
    }



    async getAllLeaveTypes(req: CustomRequest, res: Response): Promise<Response> {
        console.log("hitting get leave types==================");
        
        try {
            const result = await this._leaveService.getAllLeaveTypes();
            console.log("result", result);
            
            
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching leave types:", error);
            return res.status(500).json({ message: "Failed to fetch leave types", error });
        }
    }

    async updateLeaveTypes(req: CustomRequest, res: Response): Promise<Response> {
        console.log("hitting update leave types==================");
        
        try {
            const leaveTypeId = req.params.id;
            console.log("leaveTypeId", leaveTypeId);
            
            const data = req.body;
            console.log("data------------------------------", data);
            
            const result = await this._leaveService.updateLeaveTypes(leaveTypeId, data);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error updating leave types:", error);
            return res.status(500).json({ message: "Failed to update leave types", error });
        }
    }
}