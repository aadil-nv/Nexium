import BaseRepository from "../implementation/baseRepository";
import { IPayroll } from "../../entities/payrollEntities";

export default interface IPayrollRepository extends BaseRepository<IPayroll>  {
    getPayroll(employeeId: string): Promise<IPayroll>;
    updatePayroll(employeeId: string ,monthPayrllData:object): Promise<IPayroll>;
    downloadPayrollMonthly(employeeId: string, payrollId: string): Promise<IPayroll>;
    getPayrollDashboardData(employeeId: string): Promise<any>

} 