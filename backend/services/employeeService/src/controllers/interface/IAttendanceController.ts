import { Request ,Response } from "express";
import { CustomRequest } from "../../middlewares/tokenAuth";
export default interface IAttendanceController {
    fetchAttendance(req: Request, res: Response): Promise<Response>;
    markCheckin(req :CustomRequest, res: Response): Promise<Response>;
    markCheckout(req :CustomRequest, res: Response): Promise<Response>;
    fetchApprovedLeaves(req :CustomRequest, res: Response): Promise<Response>;
    applyLeave(req :CustomRequest, res: Response): Promise<Response>;
    updateAttendanceEntry(req :CustomRequest, res: Response): Promise<Response>;
}