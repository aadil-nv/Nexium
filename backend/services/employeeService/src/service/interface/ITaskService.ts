import { ITask } from "entities/taskEntities";
import { ITaskDTO ,IGetEmployeeWithoutTaskDTO, ITaskResponceDTO, IGetEmployeeTaskDTO} from "../../dto/ITaskDTO";


export default interface ITaskService {
    getTasks(employeeId: string): Promise<ITaskDTO[]>;
    getEmployeesToAddTask(): Promise<IGetEmployeeWithoutTaskDTO[]>
    assignTaskToEmployee(taskData: ITaskDTO , teamLeadId:string): Promise<ITaskDTO>;
    getAllTasks(): Promise<ITaskDTO[]>
    updateTask(taskId: string, taskData: ITask): Promise<ITaskResponceDTO>;
    deleteTask(taskId: string): Promise<ITaskDTO>;
    getTasksByEmployeeId(employeeId: string ,taskId?:string): Promise<ITaskDTO>
    updateTaskCompletion(data:object ,employeeId:string): Promise<ITaskDTO>;
    updateTaskApproval(data:object ,employeeId:string): Promise<ITaskDTO>;
    getTaskListOfEmployee(employeeId:string):Promise<IGetEmployeeTaskDTO[]>
    updateCompletedTask(data:object ,taskId:string): Promise<ITaskDTO>;
}