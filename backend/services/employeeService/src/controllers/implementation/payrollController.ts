import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import IPayrollController from "../../controllers/interface/IPayrollController";
import { CustomRequest } from "../../middlewares/tokenAuth";
import  IPayrollService  from "../../service/interface/IPayrollService";


@injectable()
export default class PayrollController implements IPayrollController {
    constructor(@inject("IPayrollService") private _payrollService: IPayrollService) { }

    async getPayroll(req: CustomRequest, res: Response): Promise<Response> {
        console.log("hitted get payroll----------------------------------->>>");
        
        try {
            const employeeId = req.user?.employeeData?._id;
            const payroll = await this._payrollService.getPayroll(employeeId as string);
            return res.status(200).json(payroll);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }


    }
    }