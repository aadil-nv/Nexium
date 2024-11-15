export default interface IManagerService {
    managerLogin(email: string, password: string): Promise<any>;
    addManager(data: any): Promise<any>;
}