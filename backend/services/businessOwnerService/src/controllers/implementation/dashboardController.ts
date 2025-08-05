import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import IDashboardController from "../interface/IDashBoardController";
import IDashboardService from "../../service/interface/IDashboardService";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { HttpStatusCode } from "../../utils/enums";


@injectable()

export default class DashboardController implements IDashboardController {
    constructor(@inject("IDashboardService") private _dashboardService: IDashboardService) { }

    async getAllDashboardData(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const companyId = req.user?.businessOwnerData?._id;
            const result = await this._dashboardService.getAllDashboardData(companyId as string);
            return res.status(result ? HttpStatusCode.OK : HttpStatusCode.BAD_REQUEST).json(result);
        } catch (error) {
            console.error("Error in controller:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
        }
    }
}