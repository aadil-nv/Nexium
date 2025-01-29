import { inject, injectable } from "inversify";
import ITaskRepository from "../../repository/interface/ITaskRepository";
import ITaskService from "../interface/ITaskService";
import { ITaskDTO,IGetEmployeeWithoutTaskDTO, ITaskResponceDTO ,IGetEmployeeTaskDTO, IGetTaskDashboardData } from "../../dto/ITaskDTO";
import { ITask } from "entities/taskEntities";
import e from "cors";

@injectable()
export default class TaskService implements ITaskService {
  constructor(@inject("ITaskRepository") private taskRepository: ITaskRepository) {}

  async getTasks(employeeId: string): Promise<ITaskDTO[]> {
    console.log("employeeId", employeeId);
  
    try {
      const tasks = await this.taskRepository.getTasks(employeeId); // Fetch tasks from the repository
      console.log("tasks))))))))))))))))))))))))))))))))))))))))))))", tasks);
  
      // Map tasks to the DTO format
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
  
  async getEmployeesToAddTask(teamLeadId: string): Promise<IGetEmployeeWithoutTaskDTO[]> {

    try {
      const employees = await this.taskRepository.getEmployeesToAddTask(teamLeadId)
      
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

  async assignTaskToEmployee(taskData: object, teamLeadId: string): Promise<ITaskDTO> {
    try {
      const tasks = await this.taskRepository.assignTaskToEmployee(taskData, teamLeadId);
  
      // Log the tasks to check the structure
      console.log("Assigned tasks:", tasks);
  
      // If tasks is not an array, wrap it in an array to handle uniformly
      const taskArray = Array.isArray(tasks) ? tasks : [tasks];
  
      // Check if taskArray is empty or not an array
      if (taskArray.length === 0) {
        throw new Error("Error assigning task to employee");
      }
  
      // Return the task(s) in the required DTO format
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
          taskStatus: item.taskStatus || "not started", // Default taskStatus if missing
          _id: item._id.toString()
        }))
      }))[0];  // We return the first task (in case of a single task) since it's a one-to-one assignment
  
    } catch (error) {
      console.error("Error assigning task to employee:", error);
      throw new Error("Error assigning task to employee");
    }
  }
  
  async getAllTasks(teamLeadId : string): Promise<ITaskDTO[]> {
    try {
      const tasks = await this.taskRepository.getAllTasks(teamLeadId)
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

  async getTasksByEmployeeId(employeeId: string, taskId: string): Promise<ITaskDTO> {
    try {
      const task = await this.taskRepository.getTasksByEmployeeId(employeeId, taskId);
  
      if (!task) {
        throw new Error("Task not found for the provided employeeId and taskId.");
      }
  
      console.log("Fetched task: ", task); // Inspect the structure of the fetched task
  
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
  

  async updateTaskCompletion(data: object,employeeId:string): Promise<ITaskDTO> {
    try {
      const result = await this.taskRepository.updateTaskCompletion(data ,employeeId);
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
  
  async updateTaskApproval(data: object,employeeId:string): Promise<ITaskDTO> {
    try {
      const result = await this.taskRepository.updateTaskApproval(data ,employeeId);
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

  async getTaskListOfEmployee(employeeId: string): Promise<IGetEmployeeTaskDTO[]> {
    try {
      const tasks = await this.taskRepository.getTaskListOfEmployee(employeeId);
      console.log("Fetched tasks: ", tasks); // Inspect the structure of the fetched tasks
  
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
    

  async updateCompletedTask(data: object,taskId:string): Promise<ITaskDTO> {
    try {
      const result = await this.taskRepository.updateCompletedTask(data ,taskId);
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

  async reassignTask( taskId: string , taskData:object): Promise<ITaskDTO> {
    try {
      const result = await this.taskRepository.reassignTask(taskId , taskData);
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
  
  // async getTaskDashboardData(employeeId: string): Promise<IGetTaskDashboardData> {
  //   try {
  //     // Fetch task data from the repository
  //     const taskData = await this.taskRepository.getTaskDashboardData(employeeId);
  
  //     // Ensure taskData and taskData.tasks are defined
  //     if (!taskData || !taskData.tasks) {
  //       throw new Error("No tasks found for the given employee ID.");
  //     }
  
  //     // Ensure taskData.tasks has the correct type
  //     const tasks = taskData.tasks as ITask[];
  
  //     // Calculate month-wise completed tasks
  //     const monthWiseCompletedTasks = tasks
  //       .flatMap(task => task.tasks) // Flattening the nested tasks array
  //       .filter((task) => task.isCompleted) // Filter only completed tasks
  //       .reduce((acc: Record<string, number>, task) => {
  //         const month = new Date(taskData.assignedDate).toLocaleString("default", { month: "long" }); // Use assignedDate from the parent task (taskData)
  //         acc[month] = (acc[month] || 0) + 1;
  //         return acc;
  //       }, {} as Record<string, number>);
  
  //     const monthWiseData = Object.entries(monthWiseCompletedTasks).map(([month, completedCount]) => ({
  //       month,
  //       completedCount,
  //     }));
  
  //     // Prepare dashboard data
  //     const dashboardData: IGetTaskDashboardData = {
  //       totalTasks: tasks.reduce((acc, task) => acc + task.tasks.length, 0), // Count total tasks across all employee tasks
  //       completedTasks: tasks
  //         .flatMap(task => task.tasks)
  //         .filter((task) => task.isCompleted).length, // Count completed tasks
  //       pendingTasks: tasks
  //         .flatMap(task => task.tasks)
  //         .filter((task) => !task.isCompleted).length, // Count pending tasks
  //       tasksByStatus: tasks
  //         .flatMap(task => task.tasks)
  //         .reduce((acc: Record<string, number>, task) => {
  //           acc[task.taskStatus] = (acc[task.taskStatus] || 0) + 1;
  //           return acc;
  //         }, {} as Record<string, number>),
  //       monthWiseCompletedTasks: monthWiseData,
        
  //     };
  
  //     console.log("Task dashboard data:", dashboardData);
  
  //     return dashboardData;
  //   } catch (error: any) {
  //     console.error(`Error in service layer: ${error.message}`);
  //     throw new Error(`Error in service layer: ${error.message}`);
  //   }
  // }
  
  
  
  
  
  
  
  

}
