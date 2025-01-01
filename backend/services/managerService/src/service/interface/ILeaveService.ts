import { IPayrollCriteria } from "../../entities/payrollCriteriaEntities";
import { ILeaveResonseDTO,ILeaveDTO,  ILeaveTypesDTO } from "../../dto/ILeaveDTO";
import { IAppliedLeaveDTO ,IAppliedLeaveResponce} from "../../dto/IAppliedLeaveDTO";

export default interface ILeaveService {
    updateLeaveApproval(employeeId: string, data:object): Promise<ILeaveResonseDTO>
    getAllLeaveEmployees(): Promise<ILeaveDTO[]>
    getAllLeaveTypes(): Promise<ILeaveTypesDTO[]> 
       updateLeaveTypes(leaveTypeId: string, data:object): Promise<ILeaveResonseDTO>
       fetchAllPreAppliedLeaves():Promise<IAppliedLeaveDTO[]>
       updatePreAppliedLeaves(employeeId:string ,managerId:string , data:any):Promise<IAppliedLeaveResponce>
}