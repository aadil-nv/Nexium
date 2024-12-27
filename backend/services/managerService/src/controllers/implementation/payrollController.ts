import {inject ,injectable } from "inversify";  
import { Request, Response } from "express";
import IPayrollService from "../../service/interface/IPayrollService";
import IPayrollController from "../interface/IPayrollController";
import { CustomRequest } from "../../middlewares/tokenAuthenticate";
import PayrollCriteria from "models/payrollCriteriaModel";

@injectable()
export default class PayrollController implements IPayrollController {
    constructor(
        @inject("IPayrollService") private _payrollService: IPayrollService
    ) {}
    async getAllPayrollCriteria(req: Request, res: Response): Promise<Response> {
        console.log("hitting get payroll criteria==================");
        
        try {
            const data = await this._payrollService.getPayrollCriteria();
            console.log("data--------------------------------", data);
            
            return res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching payroll criteria:", error);

            return res.status(500).json({ message: "Failed to fetch payroll criteria", error });

        }
    }

    async updatePayrollCriteria(req: CustomRequest, res: Response): Promise<Response> {        
        try {
            const payrollId = req.params.id;
            const payrollData = req.body;
            const data = await this._payrollService.updatePayrollCriteria(payrollData, payrollId);
            return res.status(200).json(data);
        } catch (error) {        
            console.error("Error updating payroll criteria:", error);
            return res.status(500).json({ message: "Failed to update payroll criteria", error });
        }
    }

    async deleteIncentive(req: CustomRequest, res: Response): Promise<Response> {
        console.log("hitting delete incentive==================");
        
        try {
            const incentiveId = req.params.id;
            console.log("payrollCriteriaId########################", incentiveId);

            const data = req.body;
            console.log("data######################################", data);
            
            const result = await this._payrollService.deleteIncentive(incentiveId , data);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error deleting incentive:", error);
            return res.status(500).json({ message: "Failed to delete incentive", error });
        }
    }
}