import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import IDashboardController from "../interface/IDashboardController";
import { CustomRequest } from "../../middlewares/tokenAuth";
import { HttpStatusCode } from "../../utils/enums";
import IDashboardService from "../../service/interface/IDashboardService";

@injectable()

export default class DashboardController implements IDashboardController {
    constructor(@inject("IDashboardService") private _dashboardService: IDashboardService) { }

    async getAllEmployeesCount(req: CustomRequest, res: Response): Promise<Response> {
        
       try {
        const employeeId = req.user?.employeeData?._id;
        if (!employeeId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Access denied. No token provided" });
        const result = await this._dashboardService.getAllDashboardData(employeeId as string);
        if(!result) return res.status(HttpStatusCode.OK).json([]);
        return res.status(HttpStatusCode.OK).json(result);
        
       } catch (error) {
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        
       }
    }
}