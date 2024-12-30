import ILeaveController  from "../interface/ILeaveController";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/tokenAuth";
import ILeaveService from "../../service/interface/ILeaveService";
import { HttpStatusCode } from "../../utils/enums";
import { inject, injectable } from "inversify";


@injectable()
export default class LeaveController implements ILeaveController {
    constructor(@inject("ILeaveService") private leaveService: ILeaveService) {}

    async applyLeave(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;

            if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
            const leaves = await this.leaveService.applyLeave(req.body, employeeId);
            return res.status(HttpStatusCode.OK).json(leaves);

            
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
            
        }
    }
}
