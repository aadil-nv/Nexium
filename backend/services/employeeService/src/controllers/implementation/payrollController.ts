import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import IPayrollController from "../../controllers/interface/IPayrollController";
import { CustomRequest } from "../../middlewares/tokenAuth";
import  IPayrollService  from "../../service/interface/IPayrollService";
import { HttpStatusCode } from "../../utils/enums";


@injectable()
export default class PayrollController implements IPayrollController {
    constructor(@inject("IPayrollService") private _payrollService: IPayrollService) { }

    private getBusinessOwnerId(req: CustomRequest): string {
        return req.user?.employeeData?.businessOwnerId || '';
    }

    async getPayroll(req: CustomRequest, res: Response): Promise<Response> {
        
        try {
            const employeeId = req.user?.employeeData?._id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const payroll = await this._payrollService.getPayroll(employeeId as string ,businessOwnerId);
            return res.status(HttpStatusCode.OK).json(payroll);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }


    }

    async downloadPayrollMonthly(req: CustomRequest, res: Response): Promise<Response> {
        
        try {
            const employeeId = req.user?.employeeData?._id;
            const payrollId = req.params.id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const payroll = await this._payrollService.downloadPayrollMonthly(employeeId as string ,payrollId ,businessOwnerId);
            return res.status(HttpStatusCode.OK).json(payroll);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
     }
    }