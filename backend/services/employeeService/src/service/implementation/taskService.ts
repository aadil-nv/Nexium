import { inject, injectable } from "inversify";
import ITaskRepository from "../../repository/interface/ITaskRepository";
import ITaskService from "../interface/ITaskService";
import { ITaskDTO,IGetEmployeeWithoutTaskDTO, ITaskResponceDTO ,IGetEmployeeTaskDTO, IGetTaskDashboardData } from "../../dto/ITaskDTO";
import { ITask } from "entities/taskEntities";
import e from "cors";

@injectable()
export default class TaskService implements ITaskService {
  constructor(@inject("ITaskRepository") private taskRepository: ITaskRepository) {}

  async getTasks(employeeId: string ,businessOwnerId:string): Promise<ITaskDTO[]> {
  
    try {
      const tasks = await this.taskRepository.getTasks(employeeId ,businessOwnerId); 

        return tasks.map((task) => ({
        _id: task._id,
        employeeId: task.employeeId.toString(), 
        taskName: task.taskName,
        employeeName: task.employeeName, 
        employeeProfilePicture: task.employeeProfilePicture ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${task.employeeProfilePicture}` : task.employeeProfilePicture,
        dueDate: task.dueDate,
        assignedBy: task.assignedBy.toString(),
        assignedDate: task.assignedDate,
        isApproved: task.isApproved,
        tasks: task.tasks.map((item) => ({
          title: item.title,
          description: item.description || "",
          isCompleted: item.isCompleted ?? false, 
          priority: item.priority || "low", 
          response: item.response || "",
          taskStatus: item.taskStatus || "backlog",
          _id: item._id
        })),
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error("Could not retrieve tasks");
    }
  }
  
  async getEmployeesToAddTask(teamLeadId: string,businessOwnerId:string): Promise<IGetEmployeeWithoutTaskDTO[]> {

    try {
      const employees = await this.taskRepository.getEmployeesToAddTask(teamLeadId,businessOwnerId)
      
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

  async assignTaskToEmployee(taskData: object, teamLeadId: string ,businessOwnerId:string): Promise<ITaskDTO> {
    try {
      const tasks = await this.taskRepository.assignTaskToEmployee(taskData, teamLeadId ,businessOwnerId);

      const taskArray = Array.isArray(tasks) ? tasks : [tasks];
  
      if (taskArray.length === 0) {
        throw new Error("Error assigning task to employee");
      }

      return taskArray.map((task: ITask) => ({
        _id: task._id.toString(),
        employeeId: task.employeeId.toString(),
        employeeName: task.employeeName,
        taskName: task.taskName,
        employeeProfilePicture: task.employeeProfilePicture
          ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${task.employeeProfilePicture}`
          : task.employeeProfilePicture,
        dueDate: task.dueDate,
        isApproved: task.isApproved ?? false,
        assignedBy: task.assignedBy.toString(),
        assignedDate: task.assignedDate,
        tasks: task.tasks.map((item) => ({
          title: item.title,
          description: item.description || "",
          isCompleted: item.isCompleted ?? false,
          response: item.response || "",
          priority: item.priority || "low",
          taskStatus: item.taskStatus || "not started", 
          _id: item._id.toString()
        }))
      }))[0]; 
  
    } catch (error) {
      console.error("Error assigning task to employee:", error);
      throw new Error("Error assigning task to employee");
    }
  }
  
  async getAllTasks(teamLeadId : string ,businessOwnerId:string): Promise<ITaskDTO[]> {
    try {
      const tasks = await this.taskRepository.getAllTasks(teamLeadId ,businessOwnerId);
      return tasks.map((task:ITask) => ({
        _id: task._id,
        employeeId: task.employeeId.toString(),
        employeeName: task.employeeName,
        taskName: task.taskName,
        assignedBy: task.assignedBy,
        assignedDate: task.assignedDate,
        isApproved: task.isApproved,

        employeeProfilePicture: task.employeeProfilePicture ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${task.employeeProfilePicture}` : task.employeeProfilePicture,
        dueDate: task.dueDate,
        tasks: task.tasks.map((item) => ({
          title: item.title,
          description: item.description || "",
          isCompleted: item.isCompleted ?? false,
          priority: item.priority || "low",
          _id: item._id,
          taskStatus: item.taskStatus,
          response:item.response
        })),
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error("Could not retrieve tasks");
    }
  }

  async updateTask(taskId: string, taskData: ITask ,businessOwnerId:string): Promise<ITaskResponceDTO> {
    try {
      const result = await this.taskRepository.updateTask(taskId, taskData ,businessOwnerId);
      if(!result) throw new Error("Error updating task");
      return { message: "Task updated successfully", success: true };
    } catch (error:any) {
      console.error("Error updating task:", error.message);
      throw new Error("Error updating task");
    }
  }

  async deleteTask(taskId: string,businessOwnerId:string): Promise<ITaskDTO> {
    try {
      const result = await this.taskRepository.deleteTask(taskId ,businessOwnerId);
      if (!result) throw new Error("Error deleting task");
  
      return {
        _id: result._id,
        employeeId: result.employeeId.toString(),
        employeeName: result.employeeName,
        taskName: result.taskName,
        assignedBy: result.assignedBy.toString(),
        assignedDate: result.assignedDate,
        isApproved: result.isApproved,
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
          taskStatus: item.taskStatus,
          response:item.response
        })),
      };
    } catch (error: any) {
      console.error("Error deleting task:", error.message);
      throw new Error("Error deleting task");
    }
  }

  async getTasksByEmployeeId(employeeId: string, taskId: string ,businessOwnerId:string): Promise<ITaskDTO> {
    try {
      const task = await this.taskRepository.getTasksByEmployeeId(employeeId, taskId ,businessOwnerId);
  
      if (!task) {
        throw new Error("Task not found for the provided employeeId and taskId.");
      }
    
      return {
        _id: task._id.toString(),
        employeeId: task.employeeId.toString(),
        employeeName: task.employeeName,
        taskName: task.taskName,
        employeeProfilePicture: task.employeeProfilePicture
          ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${task.employeeProfilePicture}`
          : "",
        dueDate: task.dueDate,
        isApproved: task.isApproved,
        assignedBy: task.assignedBy?.toString(),
        assignedDate: task.assignedDate,
        tasks: task.tasks?.length
          ? task.tasks.map((item) => ({
              _id: item._id?.toString(),
              title: item.title ,
              description: item.description ,
              isCompleted: item.isCompleted ,
              priority: item.priority,
              taskStatus: item.taskStatus,
              response:item.response
            }))
          : [],
      };
    } catch (error) {
      console.error("Error fetching tasks by employee ID:", error);
      throw new Error("Could not retrieve tasks");
    }
  }
  

  async updateTaskCompletion(data: object,employeeId:string ,businessOwnerId:string): Promise<ITaskDTO> {
    try {
      const result = await this.taskRepository.updateTaskCompletion(data ,employeeId ,businessOwnerId);
      if (!result) throw new Error("Error updating task completion");
  
      return {
        _id: result._id,
        employeeId: result.employeeId.toString(),
        employeeName: result.employeeName,
        taskName: result.taskName,
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
  
  async updateTaskApproval(data: object,employeeId:string ,businessOwnerId:string): Promise<ITaskDTO> {
    try {
      const result = await this.taskRepository.updateTaskApproval(data ,employeeId ,businessOwnerId);
      if (!result) throw new Error("Error updating task approval");
  
      return {
        _id: result._id,
        employeeId: result.employeeId.toString(),
        employeeName: result.employeeName,
        taskName: result.taskName,
        employeeProfilePicture: result.employeeProfilePicture
          ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${result.employeeProfilePicture}`
          : result.employeeProfilePicture,
        dueDate: result.dueDate,
        assignedBy: result.assignedBy.toString(),
        assignedDate: result.assignedDate,
        isApproved: result.isApproved,
        tasks: result.tasks.map((item: any) => ({
          title: item.title,
          description: item.description || "",
          isCompleted: item.isCompleted ?? false,
          priority: item.priority || "low",
          taskStatus: item.taskStatus,
          response:item.response,
          _id: item._id,          
        })),
      };
    } catch (error: any) {
      console.error("Error updating task approval:", error.message);
      throw new Error("Error updating task approval");
    }
  }

  async getTaskListOfEmployee(employeeId: string ,businessOwnerId:string): Promise<IGetEmployeeTaskDTO[]> {
    try {
      const tasks = await this.taskRepository.getTaskListOfEmployee(employeeId ,businessOwnerId);
  
      return tasks.map((task:ITask) => ({
        _id: task._id.toString(),
        employeeId: task.employeeId.toString(),
        employeeName: task.employeeName,
        taskName: task.taskName,
        employeeProfilePicture: task.employeeProfilePicture 
          ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${task.employeeProfilePicture}` 
          : task.employeeProfilePicture,
        dueDate: task.dueDate,
        isApproved: task.isApproved,
        assignedBy: task.assignedBy.toString(),
        assignedDate: task.assignedDate,
        tasks: task.tasks.map((item) => ({
          _id: item._id.toString(),
          title: item.title,
          description: item.description || "",
          isCompleted: item.isCompleted ?? false,
          priority: item.priority || "low",
          taskStatus: item.taskStatus,
          response:item.response
        }))
      }));    
    } catch (error) {
      console.error("Error fetching tasks by employee ID:", error);
      throw new Error("Could not retrieve tasks");  

    }
  }
    

  async updateCompletedTask(data: object,taskId:string,businessOwnerId:string): Promise<ITaskDTO> {
    try {
      const result = await this.taskRepository.updateCompletedTask(data ,taskId ,businessOwnerId);
      if (!result) throw new Error("Error updating task completion");
  
      return {
        _id: result._id,
        employeeId: result.employeeId.toString(),
        employeeName: result.employeeName,
        taskName: result.taskName,
        employeeProfilePicture: result.employeeProfilePicture
          ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${result.employeeProfilePicture}`
          : result.employeeProfilePicture,
        dueDate: result.dueDate,
        assignedBy: result.assignedBy.toString(),
        assignedDate: result.assignedDate,
        isApproved: result.isApproved,
        tasks: result.tasks.map((item: any) => ({
          title: item.title,
          description: item.description || "",
          isCompleted: item.isCompleted ?? false,
          priority: item.priority || "low",
          taskStatus: item.taskStatus,
          response:item.response,
          _id: item._id,          
        })),
      };
    } catch (error: any) {
      console.error("Error updating task completion:", error.message);
      throw new Error("Error updating task completion");
    }
  }

  async reassignTask( taskId: string , taskData:object ,businessOwnerId:string): Promise<ITaskDTO> {
    try {
      const result = await this.taskRepository.reassignTask(taskId , taskData ,businessOwnerId);
      if (!result) throw new Error("Error reassigning task");
  
      return {
        _id: result._id,
        employeeId: result.employeeId.toString(),
        employeeName: result.employeeName,
        taskName: result.taskName,
        employeeProfilePicture: result.employeeProfilePicture
          ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${result.employeeProfilePicture}`
          : result.employeeProfilePicture,
        dueDate: result.dueDate,
        assignedBy: result.assignedBy.toString(),
        assignedDate: result.assignedDate,
        isApproved: result.isApproved,
        tasks: result.tasks.map((item: any) => ({
          title: item.title,
          description: item.description || "",
          isCompleted: item.isCompleted ?? false,
          priority: item.priority || "low", 
          taskStatus: item.taskStatus,
          response:item.response,
          _id: item._id,
        })),
      };
    } catch (error: any) {
      console.error("Error reassigning task:", error.message);
      throw new Error("Error reassigning task");
    }
  }
  

}
