export default interface IBusinessOwnerService {
    fetchAllBusinessOwners(): Promise<any>;
    updateIsBlocked(id:string): Promise<any>;
    getDashboardData(): Promise<any>
}