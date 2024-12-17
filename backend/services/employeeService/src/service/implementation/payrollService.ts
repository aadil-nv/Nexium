import { inject, injectable } from "inversify";
import IPayrollService  from "../../service/interface/IPayrollService";
import IPayrollRepository from "../../repository/interface/IPayrollRepository";
import IEmployeeRepository from "../../repository/interface/IEmployeeRepository";
import IAttendanceRepository from "../../repository/interface/IAttendanceRepository";


@injectable()
export default class PayrollService implements IPayrollService {
    constructor(@inject("IPayrollRepository") 
    private _payrollRepository: IPayrollRepository,
    @inject("IEmployeeRepository")
    private _employeeRepository: IEmployeeRepository,
    @inject("IAttendanceRepository")
    private _attendanceRepository: IAttendanceRepository
) {}

async getPayroll(employeeId: string): Promise<any> {
    try {
      const employeeData = await this._employeeRepository.getProfile(employeeId);
      const attendanceData = await this._attendanceRepository.fetchAttendances(employeeId);

      // Ensure attendanceData is an array (or convert it to an array if it's not)
      const attendanceArray = Array.isArray(attendanceData) ? attendanceData : [attendanceData];

      const salary = employeeData.professionalDetails.salary;
      console.log("salary==========================", salary);

      const workShift = employeeData.professionalDetails.workTime;
      console.log("workShift=====================", workShift);

      console.log("attendanceData", attendanceArray);

      // Define working minutes per day based on workShift
      const workTimeMapping: { [key: string]: number } = {
        fullTime: 480,    // Full-time: 480 minutes per day
        partTime: 240,    // Part-time: 240 minutes per day
        contract: 540,    // Contract: 540 minutes per day
        temporary: 420,   // Temporary: 420 minutes per day
      };

      const requiredMinutesPerDay = workTimeMapping[workShift] || 480; // Default to full-time if no match
      
      // Calculate total working minutes for the month
      const totalWorkingMinutes = attendanceArray
        .filter(attendance => attendance.status === 'Present')
        .reduce((total, attendance) => total + attendance.workingMinutes, 0);
      
      // Calculate total working days for the month
      const totalWorkingDays = attendanceArray.filter(attendance => attendance.status === 'Present').length;
      
      console.log("totalWorkingMinutes************", totalWorkingMinutes);
      console.log("totalWorkingDays", totalWorkingDays);

      // Calculate total leave days
      const totalLeaveDays = attendanceArray.filter(attendance => attendance.leaveStatus === 'Approved').length;

      console.log("totalLeaveDays*********************", totalLeaveDays);

      // Calculate total absent days (Absence without approved leave)
      const totalAbsentDays = attendanceArray.filter(
        attendance => attendance.status === 'Absent' && attendance.leaveStatus !== 'Approved'
      ).length;

      console.log("totalAbsentDays********************", totalAbsentDays);
      
      // Calculate salary based on the total working minutes
      const totalMinutesRequiredForTheMonth = requiredMinutesPerDay * 26; // 26 working days per month
      console.log("totalMinutesRequiredForTheMonth*********************", totalMinutesRequiredForTheMonth);

      // Calculate total minutes worked from the attendance data
      const totalWorkedMinutes = attendanceArray
        .flatMap(employee => employee.attendance) // Flatten the attendance array if needed
        .reduce((total: number, att: any) => total + (att.minutes || 0), 0);

      console.log(`Total Worked Minutes: ${totalWorkedMinutes}`.bgMagenta);
      
      // Calculate working minutes ratio
      const workingMinutesRatio = totalWorkedMinutes / totalMinutesRequiredForTheMonth;

      // Calculate adjusted salary based on actual working minutes
      const totalSalary: number = salary / totalMinutesRequiredForTheMonth*totalWorkedMinutes;

      console.log("totalSalary", totalSalary);
      console.log(`"totalSalary--  $${totalSalary}`.bgBlue);

      console.log(
        "Total Working Minutes:", totalWorkingMinutes,
        "Total Working Days:", totalWorkingDays,
        "Total Leave Days:", totalLeaveDays,
        "Total Absent Days:", totalAbsentDays,
        "Adjusted Salary:", totalSalary
      );

      return {
        totalWorkingMinutes,
        totalWorkingDays,
        totalLeaveDays,
        totalAbsentDays,
        totalSalary,
      };

    } catch (error) {
      console.error(error);
      throw error;
    }
}

  
}