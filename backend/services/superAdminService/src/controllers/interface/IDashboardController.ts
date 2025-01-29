import { Request,Response } from "express";

export default interface IDashboardController { 
    getAllDashboardData(req: Request, res: Response): Promise<Response>;
}