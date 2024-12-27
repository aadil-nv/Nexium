import { IPayrollCriteria } from "entities/payrollCriteriaEntities";
import { ILeaveResonseDTO,ILeaveDTO,  ILeaveTypesDTO } from "../../dto/ILeaveDTO";

export default interface ILeaveService {
    updateLeaveApproval(employeeId: string, data:object): Promise<ILeaveResonseDTO>
    getAllLeaveEmployees(): Promise<ILeaveDTO[]>
    getAllLeaveTypes(): Promise<ILeaveTypesDTO[]> 
       updateLeaveTypes(leaveTypeId: string, data:object): Promise<ILeaveResonseDTO>
}