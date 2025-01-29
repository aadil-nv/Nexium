import { CustomRequest } from "middlewares/tokenAuth";
import { Response } from "express";

export default interface IPayrollController {   

    getPayroll(req: CustomRequest, res: Response): Promise<Response>;
    downloadPayrollMonthly(req: CustomRequest, res: Response): Promise<Response>;

}