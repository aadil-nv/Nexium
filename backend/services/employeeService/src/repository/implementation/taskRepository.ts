import { injectable, inject } from "inversify";
import mongoose, { Model } from "mongoose";
import BaseRepository from "./baseRepository";
import { ITask } from "../../entities/taskEntities";
import ITaskRepository from "../../repository/interface/ITaskRepository";
import IEmployee from "../../entities/employeeEntities";
import employeeModel from "../../models/employeeModel"; // Importing the employee model
import departmentModel from "../../models/departmentModel";

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



   async getAllTasks(teamLeadId: string): Promise<ITask[]> {
    try {
        const teamLeadData = await employeeModel.findById(teamLeadId);

        if (!teamLeadData) {
            throw new Error("Team lead not found");
        }
        const departmentId = teamLeadData?.professionalDetails.department;

        const departmentData = await departmentModel.findById(departmentId);

        if (!departmentData) {
            throw new Error("Department not found");
        }

        const employeesList = departmentData.employees.map(employee => {
            return employee.employeeId}
        );

        const allTasks = await this.taskModel.find({
            employeeId: { $in: employeesList }
        }).exec();
        

        if (!allTasks || allTasks.length === 0) {
            throw new Error("No tasks found for this department");
        }

        return allTasks;

    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error; 
    }
    }

    
    async getEmployeesToAddTask(teamLeadId: string): Promise<IEmployee[]> {
        try {
          // Fetch the Team Lead data
          const teamLeadData = await employeeModel.findById({ _id: teamLeadId });
          if (!teamLeadData) {
            throw new Error("Team Lead not found");
          }
      
          // Fetch the department data using the Team Lead's department ID
          const departmentData = await departmentModel.findById(teamLeadData.professionalDetails.department);
          if (!departmentData) {
            throw new Error("Department not found");
          }
      
          // Extract the employee IDs from the department's employees list
          const employeeIds = departmentData.employees.map((employee) => employee.employeeId);
      
          // Find employees whose position is not "Team Lead" and are in the department
          const employeesToTask = await employeeModel
            .find({
              _id: { $in: employeeIds }, // Filter by employee IDs in the department
              "professionalDetails.position": { $ne: "Team Lead" }, // Exclude "Team Lead"
            })
            .exec();
      
          if (!employeesToTask || employeesToTask.length === 0) {
            throw new Error("No employees found with a position other than Team Lead");
          }
      
          return employeesToTask;
        } catch (error) {
          console.error("Error fetching employees for task assignment:", error);
          throw new Error("Could not retrieve employees for task assignment");
        }
      }
      

    
async assignTaskToEmployee(taskData: ITask, teamLeadId: string): Promise<ITask> {
    console.log("TASK DATA FOR ASSIGN:", taskData);

    try {
        // Fetch team lead data
        const teamLeadData = await employeeModel.findById({ _id: teamLeadId });

        if (!teamLeadData) {
            throw new Error("Team Lead not found with the provided ID");
        }

        if (!taskData.employeeId) {
            throw new Error("Employee ID is required in task data");
        }

        // Fetch employee details using the employeeId from taskData
        const employee = await employeeModel.findById(taskData.employeeId);
        if (!employee) {
            throw new Error(`Employee not found with ID: ${taskData.employeeId}`);
        }

        // Include employeeName, profilePicture, assignedBy, and assignedDate in taskData
        const enrichedTaskData = {
            ...taskData,
            employeeName: employee.personalDetails.employeeName,
            employeeProfilePicture: employee.personalDetails.profilePicture,
            assignedBy: teamLeadData.personalDetails.employeeName, // Assigning team lead's name
            assignedDate: new Date(), // Setting today's date
        };

        // Create and save the task
        const task = new this.taskModel(enrichedTaskData);
        const result = await task.save();

        if (!result) {
            throw new Error("Error assigning task to employee");
        }

        return result;
    } catch (error: any) {
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

      async getTasksByEmployeeId(employeeId: string, taskId: string): Promise<ITask | null> {
        try {
            const task = await this.taskModel.findOne({
                employeeId: employeeId,
                _id: taskId, // Using _id to match the taskId
            }).exec();
    
    
            return task;
        } catch (error) {
            console.error("Error fetching task by employeeId and taskId:", error);
            throw new Error("Could not retrieve the task by employeeId and taskId");
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

    async updateTaskApproval(data: any, taskId: string): Promise<ITask | null> {
        console.log(`taskId from the body: ${taskId}`);
        console.log(`Data received: ${JSON.stringify(data)}`);
        
        try {
            // Find the task by taskId and update the 'isApproved' field
            const result = await this.taskModel.findOneAndUpdate(
                { _id: taskId }, // Match by taskId
                { $set: { isApproved: data.isApproved } }, // Update isApproved field
                { new: true } // Return the updated document
            ).exec();
    
            if (!result) {
                throw new Error(`Task with ID ${taskId} not found or update failed`);
            }
    
            console.log(`Updated task: ${JSON.stringify(result)}`);
    
            // Return the updated task object
            return result;
        } catch (error) {
            console.error("Error updating task approval:", error);
            throw new Error("Error updating task approval");
        }
    }
    
    
    async getTaskListOfEmployee(employeeId: string): Promise<ITask[]> {
        try {
          const tasks = await this.taskModel.find({ employeeId: employeeId }).exec();
          
          return tasks;
        } catch (error) {
          console.error("Error fetching tasks by employee:", error);
          throw new Error("Could not retrieve tasks by employee");
        }
    }
    
    async updateCompletedTask(data: any, taskId: string): Promise<ITask> {
        try {
            
            const subTaskId = data.taskId;  // Get the sub-taskId
    
            const result = await this.taskModel.findOneAndUpdate(
                { _id: taskId, "tasks._id": subTaskId }, // Match employeeId and sub-taskId
                { 
                    $set: {
                        "tasks.$.taskStatus": data.taskStatus,  // Update taskStatus
                        "tasks.$.isCompleted": data.isCompleted,  // Update isCompleted
                        "tasks.$.response": data.response        // Update response
                    }
                }, 
                { new: true } // Return the updated document
            ).exec();
    
            if (!result) {
                throw new Error(`Sub-task with ID ${subTaskId} not found for employee ${taskId} or update failed`);
            }
    
            return result;
        } catch (error) {
            console.error("Error updating task completion:", error);
            throw new Error("Error updating task completion");
        }
    }
    
      
}
