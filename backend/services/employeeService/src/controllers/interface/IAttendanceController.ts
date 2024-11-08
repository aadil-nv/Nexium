import { Request ,Response } from "express";
export default interface IAttendanceController {
    fetchAttendance(req: Request, res: Response): Promise<Response>;
}