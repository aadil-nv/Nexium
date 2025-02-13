import { inject,injectable } from "inversify";
import { Model } from "mongoose";
import BaseRepository from "./baseRepository";
import {IEmployeePayroll} from "../../entities/payrollEntities";
import IPayrollRepository from "../../repository/interface/IPayrollRepository"; 
import { IPayrollCriteria } from "entities/payrollCriteriaEntities";
import { getPreviousMonthAndYear } from "../../utils/getPreviousMonthAndYear ";
import connectDB from "../../config/connectDB";

@injectable()
export default class PayrollRepository extends BaseRepository<IEmployeePayroll> implements IPayrollRepository {
    constructor(@inject("IEmployeePayroll") 
    private  _payrollModel: Model<IEmployeePayroll>,
    @inject("IPayrollCriteria") 
    private _payrollCreateModel: Model<IPayrollCriteria>) {
        super(_payrollModel);
    }

    async getPayroll(employeeId: string , businessOwnerId: string): Promise<IEmployeePayroll> {
        try {
          const switchDB = await connectDB(businessOwnerId);
            const payroll = await switchDB.model<IEmployeePayroll>('Payroll', this._payrollModel.schema).findOne({ "employeeDetails.employeeId":employeeId }).exec(); // Use findOne for employeeId
            if (!payroll) {
                throw new Error(`No payroll found for employee ID: ${employeeId}`);
            }
            return payroll;
        } catch (error) {
            console.error("Error finding payroll data:", error);
            throw error;
        }
    }
    async updatePayroll(employeeId: string, employeeDetails: any, payrollDetails: any , businessOwnerId: string): Promise<IEmployeePayroll> {
      try {
        const switchDB = await connectDB(businessOwnerId);
        const PayrollModel = switchDB.model<IEmployeePayroll>('Payroll', this._payrollModel.schema);

        const payrolls = await PayrollModel.find({ "employeeDetails.employeeId": employeeId });

        const today = new Date();
        const { previousMonth, previousYear } = getPreviousMonthAndYear(today);
        const previousMonthString = previousMonth.toString();
        const previousYearString = previousYear.toString();

        const existingPayroll = payrolls.find(
            payroll => payroll.payrollDetails?.month === previousMonthString &&
                       payroll.payrollDetails?.year === previousYearString
        );

        if (existingPayroll) {
            console.log("Previous month's payroll already exists.");
            return existingPayroll; // Return existing payroll without any changes
        }

        const newPayroll = new PayrollModel({
            employeeDetails,
            payrollDetails: {
                month: previousMonthString,
                year: previousYearString,
                payDate: new Date(),
                basicSalary: payrollDetails.basicSalary || 0,
                grossSalary: payrollDetails.grossSalary || 0,
                monthlyWorkingDays: payrollDetails.monthlyWorkingDays || 0,
                totalMinutesRequiredForTheMonth: payrollDetails.totalMinutesRequiredForTheMonth || 0,
                totalWorkedMinutes: payrollDetails.totalWorkedMinutes || 0,
                totalPresentDays: payrollDetails.totalPresentDays || 0,
                totalAbsentDays: payrollDetails.totalAbsentDays || 0,
                totalApprovedLeaves: payrollDetails.totalApprovedLeaves || 0,
                approvedLeaveDaysMinutes: payrollDetails.approvedLeaveDaysMinutes || 0,
                preApprovedLeavesPaidMinutes: payrollDetails.preApprovedLeavesPaidMinutes || 0,
                incentiveAmount: payrollDetails.incentiveAmount || 0,
                bonusPayable: payrollDetails.bonusPayable || 0,
                totalDeductions: payrollDetails.totalDeductions || 0,
                pf: payrollDetails.pf || 0,
                professionalTax: payrollDetails.professionalTax || 0,
                esiFund: payrollDetails.esiFund || 0,
                netSalary: payrollDetails.netSalary || 0,
                paymentStatus: payrollDetails.paymentStatus || "Pending", // Default status
                paymentMethod: payrollDetails.paymentMethod || "Bank Transfer" // Default payment method
            }
        });

        await newPayroll.save();
        return newPayroll;
    } catch (error: any) {
        console.error("Error updating payroll:", error);
        throw new Error("Error updating payroll: " + error.message);
    }
      }
      
 
    async downloadPayrollMonthly(employeeId: string, payrollId: string , businessOwnerId: string): Promise<IEmployeePayroll> {
        try {
          const switchDB = await connectDB(businessOwnerId);
            const payroll = await switchDB.model<IEmployeePayroll>('Payroll', this._payrollModel.schema).findOne({ _id: payrollId }).exec();
            if (!payroll) {
                throw new Error("Payroll not found");
            }
            return payroll;
        } catch (error) {
            console.error("Error downloading payroll:", error);
            throw error;
        }
    }

    async getPayrollDashboardData(employeeId: string , businessOwnerId: string): Promise<any> {
        try {
          const switchDB = await connectDB(businessOwnerId);
          const employeePayroll = await switchDB.model<IEmployeePayroll>('Payroll', this._payrollModel.schema).findOne({ "employeeDetails.employeeId": employeeId });
      
          if (!employeePayroll) {
            return { employeeId, totalNetSalary: 0 };
          }
                const totalNetSalary = employeePayroll.payrollDetails.netSalary || 0;
      
          return {
            employeeId,
            totalNetSalary: totalNetSalary.toFixed(2), // Format to 2 decimal places
          };
        } catch (error) {
          console.error(error);
          throw error;
        }
    }
    
    
     async getPayrollCriteria(businessOwnerId: string): Promise<IPayrollCriteria> {
    try {
      const switchDB = await connectDB(businessOwnerId);
      const payrollCriteria = await switchDB.model<IPayrollCriteria>('PayrollCriteria', this._payrollCreateModel.schema).findOne().exec();
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