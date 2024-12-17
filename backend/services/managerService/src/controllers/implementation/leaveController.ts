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
     
        console.log(`data is FROM CONTROLLER`.bgWhite,data);
        
        const result = await this._leaveService.updateLeaveApproval(employeeId ,data);
        console.log(`result is `.bgWhite,result);
        
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
}