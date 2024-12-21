import { ITask } from "entities/taskEntities";
import { ITaskDTO ,IGetEmployeeWithoutTaskDTO, ITaskResponceDTO} from "../../dto/ITaskDTO";


export default interface ITaskService {
    getTasks(employeeId: string): Promise<ITaskDTO[]>;
    getEmployeeWithoutTask(): Promise<IGetEmployeeWithoutTaskDTO[]>
    assignTaskToEmployee(taskData: ITaskDTO): Promise<ITaskResponceDTO>;
    getAllTasks(): Promise<ITaskDTO[]>
    updateTask(taskId: string, taskData: ITask): Promise<ITaskResponceDTO>;
    deleteTask(taskId: string): Promise<ITaskDTO>;
    getTasksByEmployeeId(employeeId: string): Promise<ITaskDTO[]>
    updateTaskCompletion(data:object ,employeeId:string): Promise<ITaskDTO>;
}