export default interface IPayrollService {
    getPayroll(employeeId: string , businessOwnerId: string): Promise<any>;
    updatePayroll(employeeId: string , businessOwnerId: string): Promise<any>;
    downloadPayrollMonthly(employeeId: string, payrollId: string , businessOwnerId: string): Promise<any>;
}