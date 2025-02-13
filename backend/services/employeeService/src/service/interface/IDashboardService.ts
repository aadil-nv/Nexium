
export default interface IDashboardService {
    getAllDashboardData(employeeId: string ,businessOwnerId: string): Promise<any>;
 
}