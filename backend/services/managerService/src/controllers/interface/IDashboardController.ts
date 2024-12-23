import { Request,Response } from "express";
import { CustomRequest } from "../../middlewares/tokenAuthenticate";

export default interface IDashboardController { 
    getAllDashboardData(req: CustomRequest, res: Response): Promise<Response>;
}