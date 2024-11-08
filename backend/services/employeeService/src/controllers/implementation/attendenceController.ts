import { Request, Response } from "express";
import  IAttendanceService  from "../../service/interface/IAttendanceService";
import IAttendanceController from "../../controllers/interface/IAttendanceController";
import { inject, injectable } from "inversify";


@injectable()
export default class AttendenceController implements IAttendanceController{
    private attendanceService: IAttendanceService;

    constructor(@inject("IAttendanceService") attendanceService: IAttendanceService) {
        this.attendanceService = attendanceService ;
    }
    
    async fetchAttendance(req: Request, res: Response): Promise<Response> {
        try {
            const employeeId = req.query.employeeId as string;
            const attendances = await this.attendanceService.fetchAttendances(employeeId);
            return res.status(200).json(attendances);
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
            
        }
    }
}