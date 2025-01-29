import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import ILeaveController from "../interface/ILeaveController";
import { CustomRequest } from "../../middlewares/tokenAuthenticate";
import ILeaveService from "../../service/interface/ILeaveService";
import { log } from "util";




@injectable()
export default class LeaveController implements ILeaveController {
    constructor(@inject ("ILeaveService") private _leaveService: ILeaveService) {}

    async updateLeaveApproval(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.params.id;
            const data = req.body;
    
            const result = await this._leaveService.updateLeaveApproval(employeeId, data);
    
            if (result.success) {
                return res.status(200).json({
                    message: result.message,
                    leaveStatus: result.leaveStatus,
                    success: true
                });
            } else {
                return res.status(400).json({
                    message: result.message,
                    success: false
                });
            }
        } catch (error:any) {
            console.error("Error updating leave approval:", error);
            return res.status(500).json({
                message: "Failed to update leave approval",
                error: error.message,
                success: false
            });
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

    async fetchAllPreAppliedLeaves(req: CustomRequest, res: Response): Promise<Response>{
        console.log("hitting get leave types==================");
        
        try {
            const result = await this._leaveService.fetchAllPreAppliedLeaves();
            console.log("result", result);
            
            
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error fetch All PreAppliedLeaves  :", error);
            return res.status(500).json({ message: "Failed to fetch leave types", error });
        }
    }

    async updatePreAppliedLeaves(req: CustomRequest, res: Response): Promise<Response>{
        console.log("hitttttttttttttttttttttttttttttttttttttttttttt");
        
        try {
            const data = req.body
            console.log("data00000000000",data);
            
            const employeeId = req.params.id
            console.log("employeeId is ---->",employeeId);
            
            const managerId = req.user?.managerData?._id

            console.log("manager is --->",managerId);
            

            const response = await this._leaveService.updatePreAppliedLeaves(employeeId , managerId as string , data)
            console.log("responce is >>>>>>>>",response);
            
            return res.status(200).json(response);
            
        } catch (error) {
            console.error("Error fetch All PreAppliedLeaves  :", error);
            return res.status(500).json({ message: "Failed to update pre applied lave", error });
        }
    }

}