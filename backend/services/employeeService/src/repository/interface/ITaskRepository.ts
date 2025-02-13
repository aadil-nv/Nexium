import BaseRepository from "../../repository/implementation/baseRepository";
import { ITask } from "../../entities/taskEntities";
import IEmployee from "../../entities/employeeEntities";


export default interface ITaskRepository extends BaseRepository <ITask>{ 
    getTasks(employeeId: string ,businessOwnerId:string): Promise<ITask[]>
    getEmployeesToAddTask(teamLeadId: string ,businessOwnerId:string): Promise<IEmployee[]>
    assignTaskToEmployee(taskData: object , teamLeadId:string,businessOwnerId:string): Promise<ITask>
    updateTask(taskId: string, taskData: ITask,businessOwnerId:string): Promise<ITask>
    getAllTasks(teamLeadId : string,businessOwnerId:string): Promise<ITask[]>
    deleteTask(taskId: string ,businessOwnerId:string): Promise<ITask>
    getTasksByEmployeeId(employeeId: string ,taskId:string ,businessOwnerId:string): Promise<ITask | null>
    updateTaskCompletion(data: object  ,employeeId:string ,businessOwnerId:string): Promise<ITask>
    updateTaskApproval(data: object  ,taskId:string ,businessOwnerId:string): Promise<ITask | null>
    getTaskListOfEmployee(employeeId:string ,businessOwnerId:string): Promise<ITask[]>
    updateCompletedTask(data: object  ,employeeId:string ,businessOwnerId:string): Promise<ITask>
    getPreviousMonthCompletedTasks(employeeId: string ,businessOwnerId:string): Promise<number>
    reassignTask(taskId:string , taskData:any ,businessOwnerId:string): Promise<ITask>
    getTaskDashboardData(employeeId:string,businessOwnerId:string):Promise<any>

}