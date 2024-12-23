

export default interface IDashboardService {
    getAllDashboardData(companyId:string): Promise<any>
}