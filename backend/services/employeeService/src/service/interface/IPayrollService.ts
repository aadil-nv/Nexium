export default interface IPayrollService {
    getPayroll(employeeId: string): Promise<any>;
    updatePayroll(employeeId: string): Promise<any>;
    downloadPayrollMonthly(employeeId: string, payrollId: string): Promise<any>;
}