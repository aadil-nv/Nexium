import {inject ,injectable } from "inversify";  
import { Request, Response } from "express";
import IPayrollService from "../../service/interface/IPayrollService";
import IPayrollController from "../interface/IPayrollController";
import { CustomRequest } from "../../middlewares/tokenAuthenticate";
import PayrollCriteria from "models/payrollCriteriaModel";
import { HttpStatusCode } from "./../../utils/enums";

@injectable()
export default class PayrollController implements IPayrollController {
    constructor(
        @inject("IPayrollService") private _payrollService: IPayrollService
    ) {}
    async getAllPayrollCriteria(req: CustomRequest, res: Response): Promise<Response> {
        
        try {
            const businessOwnerId = req.user?.managerData?.businessOwnerId
            const data = await this._payrollService.getPayrollCriteria(businessOwnerId as string);
            
            return res.status(HttpStatusCode.OK).json(data);
        } catch (error) {
            console.error("Error fetching payroll criteria:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch payroll criteria", error });

        }
    }

    async updatePayrollCriteria(req: CustomRequest, res: Response): Promise<Response> {        
        try {
            const payrollId = req.params.id;
            const payrollData = req.body;
            const businessOwnerId = req.user?.managerData?.businessOwnerId
            const data = await this._payrollService.updatePayrollCriteria(payrollData, payrollId ,businessOwnerId as string);
            return res.status(HttpStatusCode.OK).json(data);
        } catch (error) {        
            console.error("Error updating payroll criteria:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to update payroll criteria", error });
        }
    }

    async deleteIncentive(req: CustomRequest, res: Response): Promise<Response> {
        
        try {
            const incentiveId = req.params.id;
            const businessOwnerId = req.user?.managerData?.businessOwnerId
            const data = req.body;
            const result = await this._payrollService.deleteIncentive(incentiveId , data ,businessOwnerId as string);
            return res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            console.error("Error deleting incentive:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to delete incentive", error });
        }
    }
}