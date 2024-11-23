export default interface IManagerService {
    connectDB(refreshToken: string): Promise<void>
    getManagers(): Promise<any>
    getManagerPersonalInfo(refreshToken: any): Promise<any>
}