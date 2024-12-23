import { inject ,injectable } from "inversify";
import { Request, Response } from "express";
import IDashboardController from "../interface/IDashboardController";
import IDashboardService from "../../service/interface/IDashboardService";
import { CustomRequest } from "../../middlewares/tokenAuthenticate";


@injectable()

export default class DashboardController implements IDashboardController {
    constructor(@inject("IDashboardService") private _dashboardService: IDashboardService) {}

    async getAllDashboardData(req: CustomRequest, res: Response): Promise<Response> {
        console.log("hitiing controller ===========================dashhh");
        
        try {
            const companyId = req.user?.managerData?._id;
            console.log("company is is",companyId);
            
            const result = await this._dashboardService.getAllDashboardData(companyId as string);
            console.log("result is ",result);
            
            return res.status(result ? 200 : 400).json(result);
        } catch (error) {
            console.error("Error in controller:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
}