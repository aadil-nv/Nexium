import { Request, Response } from "express";
import  IAttendanceService  from "../../service/interface/IAttendanceService";
import IAttendanceController from "../../controllers/interface/IAttendanceController";
import { inject, injectable } from "inversify";
import {CustomRequest} from "../../middlewares/tokenAuth";


@injectable()
export default class AttendenceController implements IAttendanceController{
    private attendanceService: IAttendanceService;

    constructor(@inject("IAttendanceService") attendanceService: IAttendanceService) {
        this.attendanceService = attendanceService ;
    }
    
    async fetchAttendance(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            const attendances = await this.attendanceService.fetchAttendances(employeeId as string);
            return res.status(200).json(attendances);
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
            
        }
    }

    async markCheckin(req:CustomRequest , res: Response): Promise<Response> {
        console.log("hitted add attendance----------------------------------->>>");
        
        try {
            const employeeId = req.user?.employeeData?._id;
            console.log("employee id from controller========>", employeeId);
            console.log("req body from controller========>", req.body);
            

            if(!employeeId) return res.status(401).json({ message: "Access denied. No token provided" });
            
            const attendance = await this.attendanceService.markCheckin(req.body, employeeId);
            return res.status(200).json(attendance);
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
            
        }
    }

    async markCheckout(req: CustomRequest, res: Response): Promise<Response> {
        try {

            const employeeId = req.user?.employeeData?._id;
            console.log("employee id from controller========>", employeeId);
            console.log("req body from controller========>", req.body);

            if(!employeeId) return res.status(401).json({ message: "Access denied. No token provided" });
            
            const attendance = await this.attendanceService.markCheckout(req.body, employeeId);
            return res.status(200).json(attendance);
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }



}