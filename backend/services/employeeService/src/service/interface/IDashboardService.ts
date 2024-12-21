import { IGetEmployeesCountDTO } from "../../dto/IDashboardDTO";

export default interface IDashboardService {
    getAllDashboardData(employeeId: string): Promise<any>;
 
}