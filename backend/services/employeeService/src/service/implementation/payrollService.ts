import { inject, injectable } from "inversify";
import IPayrollService from "../../service/interface/IPayrollService";
import IPayrollRepository from "../../repository/interface/IPayrollRepository";
import IEmployeeRepository from "../../repository/interface/IEmployeeRepository";
import IAttendanceRepository from "../../repository/interface/IAttendanceRepository";
import { IAttendanceEntry, IEmployeeAttendance } from "entities/attendanceEntities";
import { calculateWorkingDaysWithHolidays } from "../../utils/calculateWorkingDaysWithHolidays";
import { calculateDeductions } from "../../utils/calculateDeductions";
import { IGetPayRollDTO, IPayrollDTO } from "../../dto/IPayrollDTO"
import ILeaveRepository from "../../repository/interface/ILeaveRepository";
import { calculateTotalPayableMinutes } from "../../utils/calculateTotalPayableMinutes";
import { log } from "node:console";
import { calculateIncentive } from "../../utils/calculateIncentive";
import ITaskRepository from "../../repository/interface/ITaskRepository";
import { getPreviousMonthAndYear } from "../../utils/getPreviousMonthAndYear ";
@injectable()
export default class PayrollService implements IPayrollService {
  constructor(
    @inject("IPayrollRepository") private _payrollRepository: IPayrollRepository,
    @inject("IEmployeeRepository") private _employeeRepository: IEmployeeRepository,
    @inject("IAttendanceRepository") private _attendanceRepository: IAttendanceRepository,
    @inject("ILeaveRepository") private _leaveRepository: ILeaveRepository,
    @inject("ITaskRepository") private _taskRepository: ITaskRepository
  ) {}

  async updatePayroll(employeeId: string , businessOwnerId: string): Promise<any> {
    try {
      const currentDate = new Date(); // Get today's date
      const year = getPreviousMonthAndYear(currentDate).previousYear;
      const month = getPreviousMonthAndYear(currentDate).previousMonth;
      const payrollCriteria = await this._payrollRepository.getPayrollCriteria( businessOwnerId);
      const employeeData = await this._employeeRepository.getProfile(employeeId ,businessOwnerId);
      const attendanceData = await this._attendanceRepository.getPreviousMonthAttendance(employeeId,businessOwnerId);
      const monthlyWorkingDays: any = calculateWorkingDaysWithHolidays(new Date().getMonth(), new Date().getFullYear(), "IN");
      const preAprrovedLeaves = await this._leaveRepository.approvedLasmonthLeaves(employeeId ,businessOwnerId);
      const taskCount = await this._taskRepository.getPreviousMonthCompletedTasks(employeeId ,businessOwnerId);
      const position = employeeData.professionalDetails.position;      const bankAccount = employeeData.personalDetails.bankAccountNumber;
      const bankIfsc = employeeData.personalDetails.ifscCode;      
      const employeeName = employeeData.personalDetails.employeeName.toUpperCase();
      const bonuses = payrollCriteria.allowances.bonus;
      const payDate = payrollCriteria.payDay;
      const pfAccount = employeeData.professionalDetails.pfAccount;
      const esiAccount = employeeData.professionalDetails.esiAccount;      
      const uanNumber = employeeData.professionalDetails.uanNumber;
      let approvedLeaveDaysMinutes: number = 0;
      let incentiveAmount: number = 0;
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
  
       if(position !== "Team Lead"){
        incentiveAmount = calculateIncentive(payrollCriteria.incentives,taskCount, basicSalary);
       }  
    
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
  
      const totalMinutesRequiredForTheMonth = requiredMinutesPerDay * monthlyWorkingDays;
      const bonusPayable = basicSalary * bonuses / 100;
  
      const totalWorkedMinutes = attendanceArray
        .flatMap((employee) => employee.attendance)
        .reduce((total, att) => total + (att.minutes || 0), 0);
  
      const grossSalary = (basicSalary / totalMinutesRequiredForTheMonth * totalWorkedMinutes + approvedLeaveDaysMinutes + preApprovedLeavesPaidMinutes)+bonusPayable+incentiveAmount;
  
      const allDeduction = calculateDeductions(grossSalary, basicSalary, payrollCriteria.deductions);
      const { pf, professionalTax, esiFund, totalDeductions } = allDeduction;
 ;
  
      const netSalary = grossSalary - totalDeductions;
    


      const employeeDetails = {
        employeeId: employeeId,
        employeeName: employeeName,
        bankAccount: bankAccount,
        bankIfsc: bankIfsc,
        pfAccount: pfAccount,
        esiAccount: esiAccount,
        uanNumber: uanNumber,

      }

      const payrollDetails = {
        payDate: payDate,
        month: month,
        year: year,
        basicSalary: basicSalary,
        grossSalary: grossSalary,


        monthlyWorkingDays: monthlyWorkingDays,
        totalMinutesRequiredForTheMonth: totalMinutesRequiredForTheMonth,
        totalWorkedMinutes: totalWorkedMinutes,
        totalPresentDays: totalPresentDays,
        totalAbsentDays: totalAbsentDays,
        totalApprovedLeaves: totalApprovedLeaves,
        approvedLeaveDaysMinutes: approvedLeaveDaysMinutes,
        preApprovedLeavesPaidMinutes: preApprovedLeavesPaidMinutes,

        incentiveAmount: incentiveAmount,
        bonusPayable: bonusPayable,

        totalDeductions: totalDeductions,
        pf: pf,
        professionalTax: professionalTax,
        esiFund: esiFund,

        netSalary: netSalary,
      };
  
  
      await this._payrollRepository.updatePayroll(employeeId, employeeDetails, payrollDetails , businessOwnerId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  

  async getPayroll(employeeId: string , businessOwnerId: string): Promise<IGetPayRollDTO> {
    try {
      const currentDate = new Date();
  
      const payrollDate = await this._payrollRepository.getPayrollCriteria(businessOwnerId);
      if(!payrollDate){
        throw new Error("Payroll date not found");
      }
      const payDay = payrollDate.payDay;
      console.log("pay day is -=====>",payDay);
      if (currentDate.getDate() === payDay) {
        await this.updatePayroll(employeeId , businessOwnerId);
      }
  
      // Retrieve payroll data for the given employee
      const payroll = await this._payrollRepository.getPayroll(employeeId , businessOwnerId);
  
      // If payroll not found, return a default response
      if (!payroll || !payroll.employeeDetails || !payroll.payrollDetails) {
        return {
          employeeId,
          message: "Payroll not found for employee",
          success: false,
          payroll: []
        };
      }
  
      const latestPayroll = payroll.payrollDetails; 
  
      if (!latestPayroll) {
        throw new Error("Latest payroll entry is invalid");
      }
  
      const mappedPayroll: IGetPayRollDTO = {
        employeeId: payroll.employeeDetails.employeeId, 
        payroll: [
          {
            payDate: latestPayroll.payDate,
            month: latestPayroll.month,
            year: latestPayroll.year,
            totalWorkedMinutes: latestPayroll.totalWorkedMinutes ?? 0,
            totalPresentDays: latestPayroll.totalPresentDays ?? 0,
            totalAbsentDays: latestPayroll.totalAbsentDays ?? 0,
            paymentStatus: latestPayroll.paymentStatus as 'Paid' | 'Pending' | 'Failed', 
            paymentMethod: latestPayroll.paymentMethod as 'Bank Transfer' | 'Cash' | 'Cheque',
            employeeName: payroll.employeeDetails.employeeName ?? 'Unknown', // Accessing employeeName from employeeDetails
            netSalary: latestPayroll.netSalary ?? 0,
            _id: payroll._id
          }
        ]
      };
  
      return mappedPayroll;
  
    } catch (error) {
      console.error("Error retrieving payroll:", error);
      throw error;
    }
  }
  
  
  
  async downloadPayrollMonthly(employeeId: string, payrollId: string , businessOwnerId: string): Promise<IPayrollDTO> {
    try {
      const payroll = await this._payrollRepository.downloadPayrollMonthly(employeeId, payrollId , businessOwnerId);
      const employeeData = await this._employeeRepository.getProfile(employeeId , businessOwnerId);
  
      if (!payroll || !payroll.employeeDetails || !payroll.payrollDetails) {
        return {
          employeeId,
          message: "Payroll not found for employee",
          success: false,
          payroll: [] 
        };
      }
  
      const latestPayroll = payroll.payrollDetails;
  
      if (!latestPayroll) {
        throw new Error("Payroll details are invalid or missing");
      }
  
      const mappedPayroll: IPayrollDTO = {
        employeeId: payroll.employeeDetails.employeeId.toString(), // Access employeeId from employeeDetails
        message: "Payroll retrieved successfully",
        success: true,
        companyName: employeeData?.professionalDetails.companyName ?? 'abc Ltd',
        payroll: [
          {

            payDate: latestPayroll.payDate,
            month: latestPayroll.month,
            year: latestPayroll.year,
            basicSalary: latestPayroll.basicSalary ?? 0,
            grossSalary: latestPayroll.grossSalary ?? 0,
            monthlyWorkingDays: latestPayroll.monthlyWorkingDays ?? 0,
            totalMinutesRequiredForTheMonth: latestPayroll.totalMinutesRequiredForTheMonth ?? 0,
            totalWorkedMinutes: latestPayroll.totalWorkedMinutes ?? 0,
            totalPresentDays: latestPayroll.totalPresentDays ?? 0,
            totalAbsentDays: latestPayroll.totalAbsentDays ?? 0,
            totalApprovedLeaves: latestPayroll.totalApprovedLeaves ?? 0,
            approvedLeaveDaysMinutes: latestPayroll.approvedLeaveDaysMinutes ?? 0,
            preApprovedLeavesPaidMinutes: latestPayroll.preApprovedLeavesPaidMinutes ?? 0,
            incentiveAmount: latestPayroll.incentiveAmount ?? 0,
            bonusPayable: latestPayroll.bonusPayable ?? 0,
            totalDeductions: latestPayroll.totalDeductions ?? 0,
            pf: latestPayroll.pf ?? 0,
            professionalTax: latestPayroll.professionalTax ?? 0,
            esiFund: latestPayroll.esiFund ?? 0,
            netSalary: latestPayroll.netSalary ?? 0,
            paymentStatus: latestPayroll.paymentStatus || "",
            paymentMethod: latestPayroll.paymentMethod || "",
            employeeName: payroll.employeeDetails.employeeName ?? "Unknown",
            bankAccount: payroll.employeeDetails.bankAccount || "",
            pfAccount:payroll.employeeDetails.pfAccount || "",
            esiAccount:payroll.employeeDetails.esiAccount || "",
            uanNumber:payroll.employeeDetails.uanNumber || "",
            bankIfsc:payroll.employeeDetails.bankIfsc || "",
            _id: payroll._id // Assuming _id exists
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
