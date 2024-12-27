import { IPayrollCriteria } from "../../entities/payrollCriteriaEntities";
import IBaseRepository from "./IBaseRepository";

// Corrected interface name to match the repository class method
export default interface IPayrollRepository extends IBaseRepository<IPayrollCriteria> {

    getPayrollCriteria(): Promise<IPayrollCriteria[]>; // Changed to match the class method
    updatePayrollCriteria(payrollData: any, payrollId: string): Promise<IPayrollCriteria>;
    deleteIncentive( incentiveId: string ,payrollCriteriaId: string): Promise<IPayrollCriteria>;
}
