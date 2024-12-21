import { inject, injectable } from "inversify";
import ITaskRepository from "../../repository/interface/ITaskRepository";
import ITaskService from "../interface/ITaskService";
import { ITaskDTO,IGetEmployeeWithoutTaskDTO, ITaskResponceDTO } from "../../dto/ITaskDTO";
import { ITask } from "entities/taskEntities";
import e from "cors";

@injectable()
export default class TaskService implements ITaskService {
  constructor(@inject("ITaskRepository") private taskRepository: ITaskRepository) {}

  async getTasks(employeeId: string): Promise<ITaskDTO[]> {
    console.log("employeeId", employeeId);
  
    try {
      const tasks = await this.taskRepository.getTasks(employeeId); // Fetch tasks from the repository
      console.log("tasks", tasks);
  
      // Map tasks to the DTO format
      return tasks.map((task) => ({
        _id: task._id,
        employeeId: task.employeeId.toString(), 
        employeeName: task.employeeName, 
        employeeProfilePicture: task.employeeProfilePicture ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${task.employeeProfilePicture}` : task.employeeProfilePicture,
        dueDate: task.dueDate,
        tasks: task.tasks.map((item) => ({
          title: item.title,
          description: item.description || "",
          isCompleted: item.isCompleted ?? false, 
          priority: item.priority || "low", 
          _id: item._id
        })),
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error("Could not retrieve tasks");
    }
  }
  
  async getEmployeeWithoutTask(): Promise<IGetEmployeeWithoutTaskDTO[]> {

    try {
      const employees = await this.taskRepository.getEmployeeWithoutTask();
      console.log("employees----from -----service",employees);
      

      return employees.map((employee: any) => ({
        _id: employee._id.toString(),
        name: employee.personalDetails.employeeName,
        email: employee.personalDetails.email,
        position: employee.professionalDetails.position,
        profilePicture: employee.personalDetails.profilePicture ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employee.personalDetails.profilePicture}` : employee.personalDetails.profilePicture,
        isActive: employee.isActive,
      }));
    } catch (error) {
      console.error("Error fetching employees without tasks:", error);
      throw new Error("Could not retrieve employees without tasks");
    }
  }

   async assignTaskToEmployee(taskData: object): Promise<ITaskResponceDTO> {
      try {
        const result = await this.taskRepository.assignTaskToEmployee(taskData);
        if(!result) throw new Error("Error assigning task to employee");
        return { message: "Task assigned successfully", success: true };
        
      } catch (error) {
        console.error("Error assigning task to employee:", error);
        throw new Error("Error assigning task to employee");

        
      }
  }

  async getAllTasks(): Promise<ITaskDTO[]> {
    try {
      const tasks = await this.taskRepository.getAllTasks()
      return tasks.map((task:ITask) => ({
        _id: task._id,
        employeeId: task.employeeId.toString(),
        employeeName: task.employeeName,
        employeeProfilePicture: task.employeeProfilePicture ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${task.employeeProfilePicture}` : task.employeeProfilePicture,
        dueDate: task.dueDate,
        tasks: task.tasks.map((item) => ({
          title: item.title,
          description: item.description || "",
          isCompleted: item.isCompleted ?? false,
          priority: item.priority || "low",
          _id: item._id
        })),
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error("Could not retrieve tasks");
    }
  }

  async updateTask(taskId: string, taskData: ITask): Promise<ITaskResponceDTO> {
    try {
      const result = await this.taskRepository.updateTask(taskId, taskData);
      if(!result) throw new Error("Error updating task");
      return { message: "Task updated successfully", success: true };
    } catch (error:any) {
      console.error("Error updating task:", error.message);
      throw new Error("Error updating task");
    }
  }

  async deleteTask(taskId: string): Promise<ITaskDTO> {
    try {
      const result = await this.taskRepository.deleteTask(taskId);
      if (!result) throw new Error("Error deleting task");
  
      return {
        _id: result._id,
        employeeId: result.employeeId.toString(),
        employeeName: result.employeeName,
        employeeProfilePicture: result.employeeProfilePicture
          ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${result.employeeProfilePicture}`
          : result.employeeProfilePicture,
        dueDate: result.dueDate,
        tasks: result.tasks.map((item) => ({
          title: item.title,
          description: item.description || "",
          isCompleted: item.isCompleted ?? false,
          priority: item.priority || "low",
          _id: item._id,
        })),
      };
    } catch (error: any) {
      console.error("Error deleting task:", error.message);
      throw new Error("Error deleting task");
    }
  }

  async getTasksByEmployeeId(employeeId: string): Promise<ITaskDTO[]> {
    try {
      const tasks = await this.taskRepository.getTasksByEmployeeId(employeeId);
      return tasks.map((task) => ({
        _id: task._id,
        employeeId: task.employeeId.toString(),
        employeeName: task.employeeName,
        employeeProfilePicture: task.employeeProfilePicture ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${task.employeeProfilePicture}` : task.employeeProfilePicture,
        dueDate: task.dueDate,
        tasks: task.tasks.map((item) => ({
          title: item.title,
          description: item.description || "",
          isCompleted: item.isCompleted ?? false,
          priority: item.priority || "low",
          _id: item._id
        })),
      }));
    } catch (error) {
      console.error("Error fetching tasks by employee ID:", error);
      throw new Error("Could not retrieve tasks");
    }
  }

  async updateTaskCompletion(data: object,employeeId:string): Promise<ITaskDTO> {
    try {
      const result = await this.taskRepository.updateTaskCompletion(data ,employeeId);
      if (!result) throw new Error("Error updating task completion");
  
      return {
        _id: result._id,
        employeeId: result.employeeId.toString(),
        employeeName: result.employeeName,
        employeeProfilePicture: result.employeeProfilePicture
          ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${result.employeeProfilePicture}`
          : result.employeeProfilePicture,
        dueDate: result.dueDate,
        tasks: result.tasks.map((item: any) => ({
          title: item.title,
          description: item.description || "",
          isCompleted: item.isCompleted ?? false,
          priority: item.priority || "low",
          _id: item._id,
        })),
      };
    } catch (error: any) {
      console.error("Error updating task completion:", error.message);
      throw new Error("Error updating task completion");
    }
  }
  
}
