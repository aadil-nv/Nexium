import { IPayrollCriteriaDTO } from "../../dto/IPayrollDTO";

export default interface IPayrollService {
    getPayrollCriteria(businessOwnerId: string): Promise<IPayrollCriteriaDTO[]>
    updatePayrollCriteria(payrollData: any, payrollId: string,businessOwnerId: string): Promise<IPayrollCriteriaDTO>
    deleteIncentive(incentiveId: string, data: any,businessOwnerId: string): Promise<IPayrollCriteriaDTO>
}