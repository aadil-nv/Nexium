export default interface IPayrollService {
    getPayroll(employeeId: string): Promise<any>;
}