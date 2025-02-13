import { ITask } from "entities/taskEntities";
import { ITaskDTO ,IGetEmployeeWithoutTaskDTO, ITaskResponceDTO, IGetEmployeeTaskDTO, IGetTaskDashboardData} from "../../dto/ITaskDTO";


export default interface ITaskService {
    getTasks(employeeId: string ,businessOwnerId:string): Promise<ITaskDTO[]>;
    getEmployeesToAddTask(teamLeadId : string,businessOwnerId:string): Promise<IGetEmployeeWithoutTaskDTO[]>
    assignTaskToEmployee(taskData: ITaskDTO , teamLeadId:string,businessOwnerId:string): Promise<ITaskDTO>;
    getAllTasks(teamLeadId:string,businessOwnerId:string): Promise<ITaskDTO[]>
    updateTask(taskId: string, taskData: ITask,businessOwnerId:string): Promise<ITaskResponceDTO>;
    deleteTask(taskId: string,businessOwnerId:string): Promise<ITaskDTO>;
    getTasksByEmployeeId(employeeId: string ,taskId:string,businessOwnerId:string): Promise<ITaskDTO>
    updateTaskCompletion(data:object ,employeeId:string ,businessOwnerId:string): Promise<ITaskDTO>;
    updateTaskApproval(data:object ,employeeId:string ,businessOwnerId:string): Promise<ITaskDTO>;
    getTaskListOfEmployee(employeeId:string,businessOwnerId:string):Promise<IGetEmployeeTaskDTO[]>
    updateCompletedTask(data:object ,taskId:string,businessOwnerId:string): Promise<ITaskDTO>;
    reassignTask(taskId:string , taskData:object,businessOwnerId:string): Promise<ITaskDTO>;

}