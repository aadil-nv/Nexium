import {  IValidateOtpDTO } from "dto/employeeDTO";


export default interface IEmployeeService {
    employeeLogin(email: string, password: string): Promise<any>
    addEmployee(employeeData: any): Promise<any>
    validateOtp(email: string, otp: string): Promise<IValidateOtpDTO>
    resendOtp(email: string): Promise<IValidateOtpDTO>
    updateEmployee(employee: any): Promise<any>
}