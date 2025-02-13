import BaseRepository from "../implementation/baseRepository";
import { IEmployeePayroll} from "../../entities/payrollEntities";
import { IPayrollCriteria } from "../../entities/payrollCriteriaEntities";

export default interface IPayrollRepository extends BaseRepository<IEmployeePayroll>  {
    getPayroll(employeeId: string , businessOwnerId: string): Promise<IEmployeePayroll>;
    updatePayroll(employeeId: string , employeeDetails:object, payrollDetails:object , businessOwnerId: string): Promise<IEmployeePayroll>;
    downloadPayrollMonthly(employeeId: string, payrollId: string , businessOwnerId: string): Promise<IEmployeePayroll>;
    getPayrollDashboardData(employeeId: string , businessOwnerId: string): Promise<any>
    getPayrollCriteria(businessOwnerId: string): Promise<IPayrollCriteria>


} 