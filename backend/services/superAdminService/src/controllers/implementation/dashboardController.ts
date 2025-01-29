import { inject ,injectable } from "inversify";
import { Request, Response } from "express";
import IDashboardController from "../interface/IDashboardController";
import IDashboardService from "../../service/interface/IDashboardService";


@injectable()

export default class DashboardController implements IDashboardController {
    constructor(@inject("IDashboardService") private _dashboardService: IDashboardService) {}

    async getAllDashboardData(req: Request, res: Response): Promise<Response> {
        
        try {
            const result = await this._dashboardService.getAllDashboardData();
            
            return res.status(result ? 200 : 400).json(result);
        } catch (error) {
            console.error("Error in controller:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
}