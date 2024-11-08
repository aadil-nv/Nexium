export default interface IManagerService {
    login(email: string, password: string): Promise<any>;
}