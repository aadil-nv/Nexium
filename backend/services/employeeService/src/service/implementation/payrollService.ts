import { inject, injectable } from "inversify";
import IPayrollService from "../../service/interface/IPayrollService";
import IPayrollRepository from "../../repository/interface/IPayrollRepository";
import IEmployeeRepository from "../../repository/interface/IEmployeeRepository";
import IAttendanceRepository from "../../repository/interface/IAttendanceRepository";
import { IAttendanceEntry, IEmployeeAttendance } from "entities/attendanceEntities";
import { calculateWorkingDaysWithHolidays } from "../../utils/calculateWorkingDaysWithHolidays";
import { calculateDeductions } from "../../utils/calculateDeductions";
import { IPayrollDTO } from "../../dto/IPayrollDTO"
import ILeaveRepository from "../../repository/interface/ILeaveRepository";
import { calculateTotalPayableMinutes } from "../../utils/calculateTotalPayableMinutes";
@injectable()
export default class PayrollService implements IPayrollService {
  constructor(
    @inject("IPayrollRepository") private _payrollRepository: IPayrollRepository,
    @inject("IEmployeeRepository") private _employeeRepository: IEmployeeRepository,
    @inject("IAttendanceRepository") private _attendanceRepository: IAttendanceRepository,
    @inject("ILeaveRepository") private _leaveRepository: ILeaveRepository
  ) {}

  async updatePayroll(employeeId: string): Promise<any> {
    try {
      const currentDate = new Date(); // Get today's date
      const year = currentDate.getFullYear(); // Get the current year
      const month = currentDate.getMonth(); // Get the current month (0-11, so no need to add 1)
      const payrollCriteria = await this._payrollRepository.getPayrollCriteria();
      const employeeData = await this._employeeRepository.getProfile(employeeId);
      const attendanceData = await this._attendanceRepository.getPreviousMonthAttendance(employeeId);
      const MonthlyWorkingDays: any = calculateWorkingDaysWithHolidays(new Date().getMonth(), new Date().getFullYear(), "IN");
      const preAprrovedLeaves = await this._leaveRepository.approvedLasmonthLeaves(employeeId);
      console.log("preAprrovedLeaves==============================", preAprrovedLeaves);
      
  
      const bankAccount = employeeData.personalDetails.bankAccountNumber;
      const bankIfsc = employeeData.personalDetails.ifscCode;
      const employeeName = employeeData.personalDetails.employeeName.toUpperCase();
      const bonuses = payrollCriteria.allowances.bonus;
      const payDate = payrollCriteria.payDay;
      const pfAccount = employeeData.professionalDetails.pfAccount;
      const esiAccount = employeeData.professionalDetails.esiAccount;
      let approvedLeaveDaysMinutes: number = 0;
  console.log("attendanceData=====================########################=========", attendanceData);
  
      const attendanceArray = Array.isArray(attendanceData) ? attendanceData : [attendanceData];
      const basicSalary = employeeData.professionalDetails.salary;
      const workShift = employeeData.professionalDetails.workTime;
  
      const workTimeMapping: { [key: string]: number } = {
        fullTime: 480,
        partTime: 240,
        contract: 540,
        temporary: 420,
      };
  
      const requiredMinutesPerDay = workTimeMapping[workShift] || 480;
  
      const preApprovedLeavesPaidMinutes = calculateTotalPayableMinutes(preAprrovedLeaves, workShift);
  
      console.log("preApprovedLeavesPaidMinutes!!!!!!!!!!!!!!!!!!!!!!!!!!!", preApprovedLeavesPaidMinutes);
  
      const totalPresentDays = attendanceArray.reduce((total, obj: any) => {
        const count = obj.attendance.filter((att: IAttendanceEntry) => att.status === "Present").length;
        return total + count;
      }, 0);
  
      const totalApprovedLeaves = attendanceArray.reduce((total, obj: any) => {
        const count = obj.attendance.filter((att: IAttendanceEntry) => att.leaveStatus === "Approved" && att.status === "Absent").length;
        return total + count;
      }, 0);
  
      approvedLeaveDaysMinutes = totalApprovedLeaves * requiredMinutesPerDay;
  
      const totalAbsentDays = attendanceArray.reduce((total, obj: any) => {
        const count = obj.attendance.filter((att: IAttendanceEntry) => att.leaveStatus !== "Approved" && att.status === "Absent").length;
        return total + count;
      }, 0);
  
      const totalMinutesRequiredForTheMonth = requiredMinutesPerDay * MonthlyWorkingDays;
  
      const totalWorkedMinutes = attendanceArray
        .flatMap((employee) => employee.attendance)
        .reduce((total, att) => total + (att.minutes || 0), 0);
  
      const grossSalary = (basicSalary / totalMinutesRequiredForTheMonth * totalWorkedMinutes + approvedLeaveDaysMinutes + preApprovedLeavesPaidMinutes);
  
      const allDeduction = calculateDeductions(grossSalary, basicSalary, payrollCriteria.deductions);
      const { tax, pf, professionalTax, esiFund, otherDeductions, totalDeductions, netSalary } = allDeduction;
  
      const monthPayrllData = {
        totalWorkedMinutes,
        totalPresentDays,
        totalApprovedLeaves,
        totalAbsentDays,
        grossSalary,
        basicSalary,
        pf,
        tax,
        otherDeductions,
        totalDeductions: totalDeductions,
        netSalary,
        bankAccount,
        payDate,
        employeeName,
      };
  
      console.log("monthPayrllData".bgGreen, monthPayrllData); // This will now log properly
  
      await this._payrollRepository.updatePayroll(employeeId, monthPayrllData);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  

  async getPayroll(employeeId: string): Promise<IPayrollDTO> {
    try {
      const currentDate = new Date();
      if (currentDate.getDate() === 1) {
        await this.updatePayroll(employeeId);
      }
  
      const payroll = await this._payrollRepository.getPayroll(employeeId);
      if (!payroll || payroll.payroll.length === 0) {
        // Return a default IPayrollDTO when payroll is not found
        return {
          employeeId,
          message: "Payroll not found for employee",
          success: false,
          payroll: [] // Return an empty payroll array when not found
        };
      }
  
      // Assuming you want the latest payroll entry
      const latestPayroll = payroll.payroll[payroll.payroll.length - 1];
  
      // Check if latestPayroll is defined before trying to access _id
      if (!latestPayroll || !latestPayroll._id) {
        throw new Error("Latest payroll entry is invalid or missing _id");
      }
  
    
      const mappedPayroll: IPayrollDTO = {
        employeeId: payroll.employeeId.toString(),
        message: "Payroll retrieved successfully",
        success: true,
        payroll: [
          {
            month: latestPayroll.month,
            year: latestPayroll.year,
            salary: latestPayroll.salary ?? 0, // Default to 0 if undefined
            bonuses: latestPayroll.bonuses ?? 0, // Default to 0 if undefined
            deductions: latestPayroll.deductions ?? 0, // Default to 0 if undefined
            grossSalary: latestPayroll.grossSalary ?? 0, // Default to 0 if undefined
            netSalary: latestPayroll.netSalary ?? 0, // Default to 0 if undefined
            payDate: latestPayroll.payDate,
            paymentStatus: latestPayroll.paymentStatus,
            paymentMethod: latestPayroll.paymentMethod,
            taxInfo: latestPayroll.taxInfo,
            totalWorkedMinutes: latestPayroll.totalWorkedMinutes ?? 0, // Default to 0 if undefined
            totalPresentDays: latestPayroll.totalPresentDays ?? 0, // Default to 0 if undefined
            totalApprovedLeaves: latestPayroll.totalApprovedLeaves ?? 0, // Default to 0 if undefined
            totalAbsentDays: latestPayroll.totalAbsentDays ?? 0, // Default to 0 if undefined
            basicSalary: latestPayroll.basicSalary ?? 0, // Default to 0 if undefined
            pf: latestPayroll.pf ?? 0, // Default to 0 if undefined
            tax: latestPayroll.tax ?? 0, // Default to 0 if undefined
            otherDeductions: latestPayroll.otherDeductions ?? 0, // Default to 0 if undefined
            totalDeductions: latestPayroll.totalDeductions ?? 0, // Default to 0 if undefined
            bankAccount: latestPayroll.bankAccount ?? '', // Default to empty string if undefined
            employeeName: latestPayroll.employeeName ?? 'Unknown', // Handle undefined employeeName
            _id: latestPayroll._id
          }
        ]
      };
  
      return mappedPayroll;
    } catch (error) {
      console.error("Error retrieving payroll:", error);
      throw error;
    }
  }
  
  async downloadPayrollMonthly(employeeId: string, payrollId: string): Promise<IPayrollDTO> {
    try {
      const payroll = await this._payrollRepository.downloadPayrollMonthly(employeeId, payrollId);
      if (!payroll || payroll.payroll.length === 0) {
        // Return a default IPayrollDTO when payroll is not found
        return {
          employeeId,
          message: "Payroll not found for employee",
          success: false,
          payroll: [] // Return an empty payroll array when not found
        };
      }
  
      // Assuming you want the latest payroll entry
      const latestPayroll = payroll.payroll[payroll.payroll.length - 1];
  
      // Check if latestPayroll is defined before trying to access _id
      if (!latestPayroll || !latestPayroll._id) {
        throw new Error("Latest payroll entry is invalid or missing _id");
      }
  
     
    
      const mappedPayroll: IPayrollDTO = {
        employeeId: payroll.employeeId.toString(),
        message: "Payroll retrieved successfully",
        success: true,
        payroll: [
          {
            month: latestPayroll.month,
            year: latestPayroll.year,
            salary: latestPayroll.salary ?? 0, // Default to 0 if undefined
            bonuses: latestPayroll.bonuses ?? 0, // Default to 0 if undefined
            deductions: latestPayroll.deductions ?? 0, // Default to 0 if undefined
            grossSalary: latestPayroll.grossSalary ?? 0, // Default to 0 if undefined
            netSalary: latestPayroll.netSalary ?? 0, // Default to 0 if undefined
            payDate: latestPayroll.payDate,
            paymentStatus: latestPayroll.paymentStatus,
            paymentMethod: latestPayroll.paymentMethod,
            taxInfo: latestPayroll.taxInfo,
            totalWorkedMinutes: latestPayroll.totalWorkedMinutes ?? 0, // Default to 0 if undefined
            totalPresentDays: latestPayroll.totalPresentDays ?? 0, // Default to 0 if undefined
            totalApprovedLeaves: latestPayroll.totalApprovedLeaves ?? 0, // Default to 0 if undefined
            totalAbsentDays: latestPayroll.totalAbsentDays ?? 0, // Default to 0 if undefined
            basicSalary: latestPayroll.basicSalary ?? 0, // Default to 0 if undefined
            pf: latestPayroll.pf ?? 0, // Default to 0 if undefined
            tax: latestPayroll.tax ?? 0, // Default to 0 if undefined
            otherDeductions: latestPayroll.otherDeductions ?? 0, // Default to 0 if undefined
            totalDeductions: latestPayroll.totalDeductions ?? 0, // Default to 0 if undefined
            bankAccount: latestPayroll.bankAccount ?? '', // Default to empty string if undefined
            employeeName: latestPayroll.employeeName ?? 'Unknown', // Handle undefined employeeName
            _id: latestPayroll._id
          }
        ]
      };
  
      return mappedPayroll;
    } catch (error) {
      console.error("Error downloading payroll:", error);
      throw error;
    }
  }
  
  
  
  
}
