import { injectable, inject } from "inversify";
import { Model } from "mongoose";
import BaseRepository from "./baseRepository";
import { ITask } from "../../entities/taskEntities";
import ITaskRepository from "../../repository/interface/ITaskRepository";
import IEmployee from "../../entities/employeeEntities";
import employeeModel from "../../models/employeeModel"; // Importing the employee model

@injectable()
export default class TaskRepository extends BaseRepository<ITask> implements ITaskRepository {
    constructor(@inject("ITask") 
    private taskModel: Model<ITask>) {
        super(taskModel);
    }

    async getTasks(employeeId: string): Promise<ITask[]> {
        try {
            const tasks = await this.taskModel
                .find({ employeeId })
                .populate("employeeId")
                .exec();

            if (!tasks || tasks.length === 0) throw new Error("No tasks found for the given employee");

            return tasks;
        } catch (error) {
            console.error("Error fetching tasks:", error);
            throw new Error("Could not retrieve tasks");
        }
    }

    async getAllTasks(): Promise<ITask[]> {
        try {
            const tasks = await this.taskModel.find()
            
            if (!tasks || tasks.length === 0) throw new Error("No tasks found");
            return tasks;
        } catch (error) {
            console.error("Error fetching tasks:", error);
            throw new Error("Could not retrieve tasks");
        }
    }

    async getEmployeeWithoutTask(): Promise<IEmployee[]> {
        try {
            // Step 1: Get all task records and extract the employeeId from each task
            const taskEmployees = await this.taskModel
                .find({})
                .select("employeeId")
                .exec();
    
            const taskEmployeeIds = taskEmployees.map(task => task.employeeId.toString());
    
            // Step 2: Get all employees excluding those with task assignments
            // and where the position is not "Team Lead"
            const employeesWithoutTasks = await employeeModel
                .find({
                    _id: { $nin: taskEmployeeIds }, // Filter out employees with existing tasks
                    "professionalDetails.position": { $ne: "Team Lead" }, // Exclude "Team Lead"
                    isActive: true, // Only consider active employees
                })
                .exec();
            
            if (!employeesWithoutTasks || employeesWithoutTasks.length === 0) {
                throw new Error("No employees without tasks found");
            }
    
            return employeesWithoutTasks;
        } catch (error) {
            console.error("Error fetching employees without tasks:", error);
            throw new Error("Could not retrieve employees without tasks");
        }
    }
    

    async assignTaskToEmployee(taskData: ITask): Promise<ITask> {
        console.log("TASK DATA FOR ASSIGN:", taskData);
    
        try {
            // Validate that employeeId is present in taskData
            if (!taskData.employeeId) {
                throw new Error("Employee ID is required in task data");
            }
    
            // Fetch employee details using the employeeId from taskData
            const employee = await employeeModel.findById(taskData.employeeId);
            if (!employee) {
                throw new Error(`Employee not found with ID: ${taskData.employeeId}`);
            }
    
         
    
            // Include employeeName and profilePicture in taskData
            const enrichedTaskData = {
                ...taskData,
                employeeName:employee.personalDetails.employeeName,
                employeeProfilePicture: employee.personalDetails.profilePicture,
            };
    
            // Create and save the task
            const task = new this.taskModel(enrichedTaskData);
            const result = await task.save();
    
            if (!result) {
                throw new Error("Error assigning task to employee");
            }
    
            return result;
        } catch (error:any) {
            console.error("Error assigning task to employee:", error);
            throw new Error(error.message || "Error assigning task to employee");
        }
    }
    

    async updateTask(taskId: string, taskData: ITask): Promise<ITask> {
    
      
        try {
            const employee = await employeeModel.findById(taskData.employeeId);
            if (!employee) {
                throw new Error(`Employee not found with ID: ${taskData.employeeId}`);
            }
            
        
            const updatedTaskData = {
                ...taskData,
                employeeName: employee.personalDetails.employeeName,
                employeeProfilePicture: employee.personalDetails.profilePicture,
            };
        
            const result = await this.taskModel.findByIdAndUpdate({ _id:taskId}, updatedTaskData, { new: true }).exec();
            if (!result) {
                throw new Error(`Task with ID ${taskId} not found or update failed`);
            }
        
            return result;
        } catch (error:any) {
            console.error("Detailed Error:", {
                message: error.message,
                stack: error.stack,
                taskId,
                taskData,
            });
            throw new Error(error.message); // Pass original error message for debugging
        }
      }

      async deleteTask(taskId: string): Promise<ITask> {
        try {
          const result = await this.taskModel.findByIdAndDelete(taskId);
          if (!result) {
            throw new Error(`Task with ID ${taskId} not found or deletion failed`);
          }
          return result; // Return the deleted task document
        } catch (error: any) {
          console.error("Error deleting task:", error.message);
          throw new Error(error.message);
        }
      }

      async getTasksByEmployeeId(employeeId: string): Promise<ITask[]> {
        try {
          const tasks = await this.taskModel.find({ employeeId: employeeId }).exec();
          return tasks;
        } catch (error) {
          console.error("Error fetching tasks by employee:", error);
          throw new Error("Could not retrieve tasks by employee");
        }
    }

    async updateTaskCompletion( data: {taskId: string, isCompleted: boolean }, employeeId: string): Promise<ITask> {
        try {
            const result = await this.taskModel.findOneAndUpdate(
                { "employeeId": employeeId, "tasks._id": data.taskId }, // Match both employeeId and taskId
                { $set: { "tasks.$.isCompleted": data.isCompleted } }, // Update isCompleted in the specific task
                { new: true } // Return the updated document
            ).exec();
    
            if (!result) {
                throw new Error(`Task with ID ${data.taskId} not found for employee ${employeeId} or update failed`);
            }
    
            return result;
        } catch (error) {
            console.error("Error updating task completion:", error);
            throw new Error("Error updating task completion");
        }
    }
    
      
}
