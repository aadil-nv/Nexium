import { inject,injectable } from "inversify";
import { FilterQuery, Model } from "mongoose";
import BaseRepository from "./baseRepository";
import {IEmployeePayroll} from "../../entities/payrollEntities";
import IPayrollRepository from "../../repository/interface/IPayrollRepository"; 
import payrollModel from "../../models/payrollModel";
import { IPayrollCriteria } from "entities/payrollCriteriaEntities";
import { getPreviousMonthAndYear } from "../../utils/getPreviousMonthAndYear ";

@injectable()
export default class PayrollRepository extends BaseRepository<IEmployeePayroll> implements IPayrollRepository {
    constructor(@inject("IEmployeePayroll") 
    private  _payrollModel: Model<IEmployeePayroll>,
    @inject("IPayrollCriteria") 
    private _payrollCreateModel: Model<IPayrollCriteria>) {
        super(_payrollModel);
    }

    async getPayroll(employeeId: string): Promise<IEmployeePayroll> {
        try {
            const payroll = await this._payrollModel.findOne({ "employeeDetails.employeeId":employeeId }).exec(); // Use findOne for employeeId
            if (!payroll) {
                throw new Error(`No payroll found for employee ID: ${employeeId}`);
            }
            return payroll;
        } catch (error) {
            console.error("Error finding payroll data:", error);
            throw error;
        }
    }
    async updatePayroll(employeeId: string, employeeDetails: any, payrollDetails: any): Promise<IEmployeePayroll> {
        try {
          // Find all existing payroll entries for the employee
          const payrolls = await this._payrollModel.find({ "employeeDetails.employeeId": employeeId }).exec();
      
          // Get today's date and extract the current month and year
          const today = new Date();
          const currentMonth = today.getMonth() + 1; // Months are 0-indexed
          const currentYear = today.getFullYear();
      
          // Calculate the previous month and year using the getPreviousMonthAndYear function
          const { previousMonth, previousYear } = getPreviousMonthAndYear(today);
      
          // Convert previousMonth and previousYear to strings for comparison
          const previousMonthString = previousMonth.toString();
          const previousYearString = previousYear.toString();
      
          // Check if payroll for the previous month already exists
          const existingPayroll = payrolls.find(
            (payroll) => 
              payroll.payrollDetails?.month === previousMonthString && 
              payroll.payrollDetails?.year === previousYearString
          );
      
          // If payroll for the previous month exists, return it
          if (existingPayroll) {
            console.log("Previous month's payroll already exists.");
            return existingPayroll; // Return the existing payroll without any changes
          }
      
          // If no payroll for the previous month exists, create a new one
          const newPayroll = new this._payrollModel({
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
              paymentStatus: payrollDetails.paymentStatus || 'Pending',  // Default status
              paymentMethod: payrollDetails.paymentMethod || 'Bank Transfer', // Default payment method
            }
          });
      
          // Save the new payroll record
          await newPayroll.save();
      
          // Return the newly created payroll document
          return newPayroll;
        } catch (error) {
          console.error("Error updating payroll:", error);
          throw error;
        }
      }
      
 
    async downloadPayrollMonthly(employeeId: string, payrollId: string): Promise<IEmployeePayroll> {
        try {
            const payroll = await this._payrollModel.findOne({ _id: payrollId }).exec();
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
          // Find the employee's payroll data
          const employeePayroll = await this._payrollModel.findOne({ "employeeDetails.employeeId": employeeId });
      
          // If no payroll is found, return default data
          if (!employeePayroll) {
            return { employeeId, totalNetSalary: 0 };
          }
      
          // Since we have only one payroll document, no need to reduce across multiple records
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