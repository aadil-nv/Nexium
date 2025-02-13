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

  async getAllDashboardData(employeeId: string ,businessOwnerId: string): Promise<any> {
  
    try {
      const employeeData = await this._employeeRepository.getProfile(employeeId ,businessOwnerId);
      
      const isTeamLead = employeeData.professionalDetails.position === 'Team Lead'; // Assuming the position check
  
      let dashboardData;
  
      if (isTeamLead) {
        dashboardData = await this._projectService.getProjectDashboardData(employeeId ,businessOwnerId);
      } else {
        dashboardData = await this.taskRepository.getTaskDashboardData(employeeId ,businessOwnerId); // Assuming there is a task repository
      }
  
      const attendanceData = await this._attendanceRepository.getAttendanceDashboardData(employeeId,businessOwnerId);
  
      const payrollData = await this._payrollRepository.getPayrollDashboardData(employeeId ,businessOwnerId);
    
      return {
        ...payrollData,
        ...attendanceData,
        dashboardData, 
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  }
  
}
