import { inject,injectable } from "inversify";
import { FilterQuery, Model } from "mongoose";
import BaseRepository from "./baseRepository";
import {IPayroll} from "../../entities/payrollEntities";
import IPayrollRepository from "../../repository/interface/IPayrollRepository"; 
import payrollModel from "../../models/payrollModel";

@injectable()
export default class PayrollRepository extends BaseRepository<IPayroll> implements IPayrollRepository {
    constructor(@inject("IPayroll") private  _payrollModel: Model<IPayroll>) {
        super(_payrollModel);
    }

    async getPayroll(employeeId: string): Promise<IPayroll> {
        try {
            const payroll = await this._payrollModel.findOne({ employeeId }).exec(); // Use findOne for employeeId
            if (!payroll) {
                throw new Error(`No payroll found for employee ID: ${employeeId}`);
            }
            return payroll;
        } catch (error) {
            console.error("Error finding payroll data:", error);
            throw error;
        }
    }
    
    

}