import { IValidateOtpDTO } from "dto/managerDTO";

export default interface IManagerService {
    managerLogin(email: string, password: string): Promise<any>;
    addManager(data: any): Promise<any>;
    sendOtp(email: string, otp: string): Promise<void>;
    validateOtp(email: string, otp: string): Promise<any>;
    resendOtp(email: string): Promise<IValidateOtpDTO>;
    blockManager(managerData: any): Promise<any>;
    updateManger(managerData: any): Promise<any>
}