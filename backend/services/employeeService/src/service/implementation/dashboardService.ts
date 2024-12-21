import { inject, injectable } from "inversify";
import IDashboardService from "../interface/IDashboardService";
import IEmployeeRepository from "../../repository/interface/IEmployeeRepository";
import IAttendanceRepository from "../../repository/interface/IAttendanceRepository";
import IDepartmentRepository from "../../repository/interface/IDepartmentRepository";
import IPayrollRepository from "../../repository/interface/IPayrollRepository";

@injectable()
export default class DashboardService implements IDashboardService {
  constructor(
    @inject("IEmployeeRepository")
    private readonly _employeeRepository: IEmployeeRepository,

    @inject("IAttendanceRepository")
    private readonly _attendanceRepository: IAttendanceRepository,

    @inject("IPayrollRepository")
    private readonly _payrollRepository: IPayrollRepository,

    @inject("IDepartmentRepository")
    private readonly _departmentRepository: IDepartmentRepository
  ) {}

  async getAllDashboardData(employeeId: string): Promise<any> {
    console.log("employeeId--------------------------",employeeId);
    
    try {
      const attendanceData = await this._attendanceRepository.getAttendanceDashboardData(employeeId);
      console.log("attendanceData--------------------------",attendanceData);
      

      const payrollData = await this._payrollRepository.getPayrollDashboardData(employeeId);
      console.log("payrollData--------------------------",payrollData);
      
      const employeeData = await this._employeeRepository.getEmployeeDashboardData(employeeId);
      console.log("employeeData--------------------------",employeeData);

      return {
        ...employeeData,
        ...payrollData,
        ...attendanceData,
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  }
}
