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

    async getEmployeeWithoutTask(): Promise<IEmployee[]> {
        try {
            // Step 1: Get all task records and extract the employeeId from each task
            const taskEmployees = await this.taskModel
                .find({})
                .select("employeeId")
                .exec();

                

            // Step 2: Extract employeeIds from tasks
            const taskEmployeeIds = taskEmployees.map(task => task.employeeId.toString());


            // Step 3: Get all employees excluding those with task assignments
            const employeesWithoutTasks = await employeeModel
                .find({
                    _id: { $nin: taskEmployeeIds }, // Filter out employees with existing tasks
                     // Only consider active employees
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

    async assignTaskToEmployee(taskData: object): Promise<ITask> {
        try {
            const task = new this.taskModel(taskData);
            const result = await task.save();
            if(!result) throw new Error("Error assigning task to employee");
            return result;
        } catch (error) {
            console.error("Error assigning task to employee:", error);
            throw new Error("Error assigning task to employee");
        }
    }

    async updateTask(taskId: string, taskData: ITask): Promise<ITask> {
        console.log("taskId-------->", taskId);
        console.log("taskData========>>>", taskData);
      
        try {
          // Fetch employee data by employeeId
          const employeeId = taskData.employeeId;
          const employee = await employeeModel.findById(taskData.employeeId);
          
          if (!employee) {
            throw new Error("Employee not found");
          }
      
          // Prepare the updated task data with employee information
          const updatedTaskData = {
            ...taskData,
            employeeName: employee.personalDetails.employeeName,  // Add employee name
            employeeProfilePicture: employee.personalDetails.profilePicture,  // Add employee profile picture
          };
      
          // Update the task in the taskModel (assuming taskModel is your task schema/model)
          const result = await this.taskModel.findByIdAndUpdate(taskId, updatedTaskData, { new: true }).exec();
          
          if (!result) {
            throw new Error("Error updating task");
          }
      
          return result;
        } catch (error) {
          console.error("Error updating task:", error);
          throw new Error("Error updating task");
        }
      }
}
