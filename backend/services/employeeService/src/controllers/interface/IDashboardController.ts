import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/tokenAuth";

export default interface IDashboardController {
    getAllEmployeesCount(req: CustomRequest, res: Response): Promise<Response>;
   
}
