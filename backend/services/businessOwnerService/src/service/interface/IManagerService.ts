
export default interface IManagerService {
    getProfile(companyId: string, managerId: string): Promise<any>;
}