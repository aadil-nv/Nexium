import BaseRepository from "../../repository/implementation/baseRepository";
import { ITask } from "../../entities/taskEntities";
import IEmployee from "../../entities/employeeEntities";


export default interface ITaskRepository extends BaseRepository <ITask>{ 
    getTasks(employeeId: string): Promise<ITask[]>
    getEmployeeWithoutTask(): Promise<IEmployee[]>
    assignTaskToEmployee(taskData: object): Promise<ITask>
    updateTask(taskId: string, taskData: ITask): Promise<ITask>
}