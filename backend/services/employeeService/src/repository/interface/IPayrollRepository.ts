import BaseRepository from "../implementation/baseRepository";
import { IEmployeePayroll} from "../../entities/payrollEntities";
import { IPayrollCriteria } from "../../entities/payrollCriteriaEntities";

export default interface IPayrollRepository extends BaseRepository<IEmployeePayroll>  {
    getPayroll(employeeId: string): Promise<IEmployeePayroll>;
    updatePayroll(employeeId: string , employeeDetails:object, payrollDetails:object): Promise<IEmployeePayroll>;
    downloadPayrollMonthly(employeeId: string, payrollId: string): Promise<IEmployeePayroll>;
    getPayrollDashboardData(employeeId: string): Promise<any>
    getPayrollCriteria(): Promise<IPayrollCriteria>


} 