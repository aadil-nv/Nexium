import { inject,injectable } from "inversify";
import { FilterQuery, Model } from "mongoose";
import BaseRepository from "./baseRepository";
import {IPayroll} from "../../entities/payrollEntities";
import IPayrollRepository from "../../repository/interface/IPayrollRepository"; 
import payrollModel from "../../models/payrollModel";
import { IPayrollCriteria } from "entities/payrollCriteriaEntities";

@injectable()
export default class PayrollRepository extends BaseRepository<IPayroll> implements IPayrollRepository {
    constructor(@inject("IPayroll") 
    private  _payrollModel: Model<IPayroll>,
    @inject("IPayrollCriteria") 
    private _payrollCreateModel: Model<IPayrollCriteria>) {
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
    async updatePayroll(employeeId: string, monthPayrollData: any): Promise<IPayroll> {
    
        try {
            let payroll = await this._payrollModel.findOne({ employeeId }).exec() || 
                          new this._payrollModel({ employeeId, payroll: [] });
    
            const payDate = new Date(monthPayrollData.payDate);
            const currentMonth = payDate.getMonth() + 1;
            const currentYear = payDate.getFullYear();
            const previousMonth = currentMonth - 1;
    
            const updatedPayrollData = { month: previousMonth, year: currentYear, ...monthPayrollData };
    
            if (payroll.payroll.some(entry => Number(entry.month) === previousMonth)) {
                console.log("Previous month's payroll already exists.");
                return payroll;
            }
    
            if (payroll.payroll.some(entry => Number(entry.month) === updatedPayrollData.month)) {
                console.log('Payroll for this month already exists.');
                return payroll;
            }
    
            payroll.payroll.push(updatedPayrollData);
            await payroll.save();
            return payroll;
        } catch (error) {
            console.error("Error updating payroll:", error);
            throw error;
        }
    }
 
    async downloadPayrollMonthly(employeeId: string, payrollId: string): Promise<IPayroll> {
        try {
            const payroll = await this._payrollModel.findOne({ employeeId, "payroll._id": payrollId }).exec();
            if (!payroll) {
                throw new Error("Payroll not found");
            }
            return payroll;
        } catch (error) {
            console.error("Error downloading payroll:", error);
            throw error;
        }
    }

    async getPayrollDashboardData(employeeId: string): Promise<any> {

  try {
    const employeePayroll = await this._payrollModel.findOne({ employeeId });

    if (!employeePayroll) {
     return { employeeId, totalNetSalary: 0 };
    }

    // Calculate total net salary
    const totalNetSalary = employeePayroll.payroll.reduce((sum, record) => sum + (record.netSalary || 0), 0);

    return {
      employeeId,
      totalNetSalary: totalNetSalary.toFixed(2), // Format to 2 decimal places
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

    
async getPayrollCriteria(): Promise<IPayrollCriteria> {
    try {
        const payrollCriteria = await this._payrollCreateModel.findOne().exec();
        if (!payrollCriteria) {
            throw new Error(`No payroll criteria found`);
        }
        return payrollCriteria;
    } catch (error) {
        console.error("Error finding payroll criteria:", error);
        throw error;
    }
}


    
    

}