import { inject, injectable } from "inversify";
import IDashboardService from "../interface/IDashboardService";
import IEmployeeRepository from "../../repository/interface/IEmployeeRepository";
import IAttendanceRepository from "../../repository/interface/IAttendanceRepository";
import IDepartmentRepository from "../../repository/interface/IDepartmentRepository";
import IPayrollRepository from "../../repository/interface/IPayrollRepository";
import IProjectRepository from "repository/interface/IProjectRepository";
import ITaskRepository from "repository/interface/ITaskRepository";
import IProjectService from "service/interface/IProjectService";
import ITaskService from "service/interface/ITaskService";

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
    private readonly _departmentRepository: IDepartmentRepository,

    @inject("IProjectService") 
    private readonly _projectService: IProjectService ,
    @inject("ITaskRepository") 
    private readonly taskRepository: ITaskRepository
  ) {}

  async getAllDashboardData(employeeId: string): Promise<any> {
    console.log("employeeId--------------------------", employeeId);
  
    try {
      // Fetch employee data to check if the employee is a Team Lead
      const employeeData = await this._employeeRepository.getProfile(employeeId);
      console.log(employeeData);
      
      const isTeamLead = employeeData.professionalDetails.position === 'Team Lead'; // Assuming the position check
  
      let dashboardData;
  
      // Fetch project or task dashboard data based on position
      if (isTeamLead) {
        dashboardData = await this._projectService.getProjectDashboardData(employeeId);
        console.log("Project Dashboard Data--------------------------", dashboardData);
      } else {
        dashboardData = await this.taskRepository.getTaskDashboardData(employeeId); // Assuming there is a task repository
        console.log("Task Dashboard Data--------------------------", dashboardData);
      }
  
      // Fetch attendance, payroll, and employee dashboard data
      const attendanceData = await this._attendanceRepository.getAttendanceDashboardData(employeeId);
      // console.log("Attendance Data--------------------------", attendanceData);
  
      const payrollData = await this._payrollRepository.getPayrollDashboardData(employeeId);
    
      return {
        // ...employeeDashboardData,
        ...payrollData,
        ...attendanceData,
        dashboardData,  // Include the project or task dashboard data
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  }
  
}
