import { ILeaveResonseDTO,ILeaveDTO,  ILeaveTypesDTO } from "../../dto/ILeaveDTO";
import { IAppliedLeaveDTO ,IAppliedLeaveResponce} from "../../dto/IAppliedLeaveDTO";

export default interface ILeaveService {
    updateLeaveApproval(employeeId: string, data:object, businessOwnerId: string): Promise<ILeaveResonseDTO>
    getAllLeaveEmployees(buisinessownerId: string): Promise<ILeaveDTO[]>
    getAllLeaveTypes(businessOwnerId: string): Promise<ILeaveTypesDTO[]> 
    updateLeaveTypes(leaveTypeId: string, data:object, businessOwnerId: string): Promise<ILeaveResonseDTO>
    fetchAllPreAppliedLeaves(businessOwnerId: string):Promise<IAppliedLeaveDTO[]>
    updatePreAppliedLeaves(employeeId:string ,managerId:string , data:any ,businessOwnerId: string):Promise<IAppliedLeaveResponce>
}