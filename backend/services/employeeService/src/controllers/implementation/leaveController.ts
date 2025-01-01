import ILeaveController  from "../interface/ILeaveController";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/tokenAuth";
import ILeaveService from "../../service/interface/ILeaveService";
import { HttpStatusCode } from "../../utils/enums";
import { inject, injectable } from "inversify";


@injectable()
export default class LeaveController implements ILeaveController {
    constructor(@inject("ILeaveService") private _leaveService: ILeaveService) {}

    async applyLeave(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            console.log("employee id is ==>",employeeId);
            
            const data = req.body 
            console.log("data from leave -<",data);
            


            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const leaves = await this._leaveService.applyLeave(employeeId ,data );
            return res.status(HttpStatusCode.OK).json(leaves);

            
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
            
        }
    }


    async fetchAppliedLeaves(req: CustomRequest, res: Response):Promise<Response>{
        
        try {
            const employeeId = req.user?.employeeData?._id;
 
            const leaves  = await this._leaveService.fetchAppliedLeaves(employeeId as string)
            
            return res.status(HttpStatusCode.OK).json(leaves);

        } catch (error) {

        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });

        }

    }

    async updateAppliedLeave(req: CustomRequest, res: Response):Promise<Response>{
        console.log("hitting controller =================");
        
        try {
            const employeeId = req.user?.employeeData?._id;
            console.log("employee id is ==>",employeeId);
            
            const leaveId = req.params.id;
            console.log("leave id is ==>",leaveId);
            
            const leaveData = req.body
            console.log("leave data is ==>",leaveData);
            
            const leaves  = await this._leaveService.updateAppliedLeave(employeeId as string,leaveId as string,leaveData)
            console.log("leaved dta all-------------------",leaves);
            
            return res.status(HttpStatusCode.OK).json(leaves);

        } catch (error) {

                        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });

        }    
    }

    async deleteAppliedLeave(req: CustomRequest, res: Response):Promise<Response>{
        try {
            const employeeId = req.user?.employeeData?._id;
            const leaveId = req.params.id;
            const leaves  = await this._leaveService.deleteAppliedLeave(employeeId as string,leaveId as string)
            return res.status(HttpStatusCode.OK).json(leaves);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
}
