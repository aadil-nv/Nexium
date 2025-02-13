

export default interface IDashboardService {
    getAllDashboardData(managerId:string, businessOwnerId: string): Promise<any>
}