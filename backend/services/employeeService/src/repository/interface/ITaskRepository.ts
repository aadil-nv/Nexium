import BaseRepository from "../../repository/implementation/baseRepository";
import { ITask } from "../../entities/taskEntities";
import IEmployee from "../../entities/employeeEntities";


export default interface ITaskRepository extends BaseRepository <ITask>{ 
    getTasks(employeeId: string): Promise<ITask[]>
    getEmployeesToAddTask(teamLeadId: string): Promise<IEmployee[]>
    assignTaskToEmployee(taskData: object , teamLeadId:string): Promise<ITask>
    updateTask(taskId: string, taskData: ITask): Promise<ITask>
    getAllTasks(teamLeadId : string): Promise<ITask[]>
    deleteTask(taskId: string): Promise<ITask>
    getTasksByEmployeeId(employeeId: string ,taskId:string): Promise<ITask | null>
    updateTaskCompletion(data: object  ,employeeId:string): Promise<ITask>
    updateTaskApproval(data: object  ,taskId:string): Promise<ITask | null>
    getTaskListOfEmployee(employeeId:string): Promise<ITask[]>
    updateCompletedTask(data: object  ,employeeId:string): Promise<ITask>
    getPreviousMonthCompletedTasks(employeeId: string): Promise<number>
    reassignTask(taskId:string , taskData:any): Promise<ITask>
    getTaskDashboardData(employeeId:string):Promise<any>

}