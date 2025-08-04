import { injectable, inject } from "inversify";
import mongoose, { Model } from "mongoose";
import BaseRepository from "./baseRepository";
import { ITask } from "../../entities/taskEntities";
import ITaskRepository from "../../repository/interface/ITaskRepository";
import IEmployee from "../../entities/employeeEntities";
import employeeModel from "../../models/employeeModel"; // Importing the employee model
import departmentModel from "../../models/departmentModel";
import { TaskStatusCount, MonthlyTaskData, TaskStats,
     TaskPriorities, DashboardResponse, MonthlyAggregationResult, StatusAggregationResult } from '../../dto/ITaskDTO';
     import connectDB from "../../config/connectDB";
import IDepartment from "../../entities/departmentEntities";



@injectable()
export default class TaskRepository extends BaseRepository<ITask> implements ITaskRepository {
    constructor(@inject("ITask") 
    private taskModel: Model<ITask>) {
        super(taskModel);
    }

    async getTasks(employeeId: string ,businessOwnerId:string): Promise<ITask[]> {
        try {
           const switchDB = await connectDB(businessOwnerId);
            const tasks = await switchDB
                .model<ITask>("Task", this.taskModel.schema)
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



   async getAllTasks(teamLeadId: string ,businessOwnerId:string): Promise<ITask[]> {
    try {
      const switchDB = await connectDB(businessOwnerId);
        const teamLeadData = await switchDB.model<IEmployee>("Employee", employeeModel.schema).findById(teamLeadId);

        if (!teamLeadData) {
            throw new Error("Team lead not found");
        }
        const departmentId = teamLeadData?.professionalDetails.department;

        const departmentData = await switchDB.model<IDepartment>("Department", departmentModel.schema).findById(departmentId);

        if (!departmentData) {
            throw new Error("Department not found");
        }

        const employeesList = departmentData.employees.map(employee => {
            return employee.employeeId}
        );

        const allTasks = await switchDB.model<ITask>("Task", this.taskModel.schema).find({
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

    
    async getEmployeesToAddTask(teamLeadId: string,businessOwnerId:string): Promise<IEmployee[]> {
        try {
          const switchDB = await connectDB(businessOwnerId);
          const teamLeadData = await switchDB.model<IEmployee>("Employee", employeeModel.schema).findById({ _id: teamLeadId });
          if (!teamLeadData) {
            throw new Error("Team Lead not found");
          }
      
          const departmentData = await switchDB.model<IDepartment>("Department", departmentModel.schema).findById(teamLeadData.professionalDetails.department);
          if (!departmentData) {
            throw new Error("Department not found");
          }
      
          const employeeIds = departmentData.employees.map((employee) => employee.employeeId);
          const employeesToTask = await switchDB.model<IEmployee>("Employee", employeeModel.schema)
            .find({
              _id: { $in: employeeIds }, 
              "professionalDetails.position": { $ne: "Team Lead" }, 
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
      

    
      async assignTaskToEmployee(taskData: ITask, teamLeadId: string,businessOwnerId:string): Promise<ITask> {
        try {
          const switchDB = await connectDB(businessOwnerId);
              const EmployeeModel = switchDB.model<IEmployee>("Employee", employeeModel.schema);
          const TaskModel = switchDB.model<ITask>("Task", this.taskModel.schema);
      
          const teamLeadData = await EmployeeModel.findById(teamLeadId);
          console.log(`Assigning task `.bgYellow, teamLeadData);
      
          if (!teamLeadData) {
            throw new Error("Team Lead not found with the provided ID");
          }
      
          if (!taskData.employeeId) {
            throw new Error("Employee ID is required in task data");
          }
      
          const employee = await EmployeeModel.findById(taskData.employeeId);
          if (!employee) {
            throw new Error(`Employee not found with ID: ${taskData.employeeId}`);
          }
      
          const enrichedTaskData = {
            ...taskData,
            employeeName: employee.personalDetails.employeeName,
            employeeProfilePicture: employee.personalDetails.profilePicture,
            assignedBy: teamLeadData.personalDetails.employeeName,
            assignedDate: new Date(),
          };
      
          const task = new TaskModel(enrichedTaskData);
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

    async updateTask(taskId: string, taskData: ITask,businessOwnerId:string): Promise<ITask> {
    
        try {
            const switchDB = await connectDB(businessOwnerId);
            const employee = await switchDB.model<IEmployee>("Employee", employeeModel.schema).findById(taskData.employeeId);
            if (!employee) {
                throw new Error(`Employee not found with ID: ${taskData.employeeId}`);
            }
            
        
            const updatedTaskData = {
                ...taskData,
                employeeName: employee.personalDetails.employeeName,
                employeeProfilePicture: employee.personalDetails.profilePicture,
            };
        
            const result = await switchDB.model<ITask>("Task", this.taskModel.schema).findByIdAndUpdate({ _id:taskId}, updatedTaskData, { new: true }).exec();
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
            throw new Error(error.message);
        }
    }

    async deleteTask(taskId: string ,businessOwnerId:string): Promise<ITask> {
        try {
          const switchDB = await connectDB(businessOwnerId);
          const result = await switchDB.model<ITask>("Task", this.taskModel.schema).findByIdAndDelete(taskId);
          if (!result) {
            throw new Error(`Task with ID ${taskId} not found or deletion failed`);
          }
          return result; 
        } catch (error: any) {
          console.error("Error deleting task:", error.message);
          throw new Error(error.message);
        }
    }

    async getTasksByEmployeeId(employeeId: string, taskId: string ,businessOwnerId:string): Promise<ITask | null> {
        try {
          const switchDB = await connectDB(businessOwnerId);
            const task = await switchDB.model<ITask>("Task", this.taskModel.schema).findOne({
                employeeId: employeeId,
                _id: taskId, 
            }).exec();
    
    
            return task;
        } catch (error) {
            console.error("Error fetching task by employeeId and taskId:", error);
            throw new Error("Could not retrieve the task by employeeId and taskId");
        }
    }
    

    async updateTaskCompletion( data: {taskId: string, isCompleted: boolean }, employeeId: string ,businessOwnerId:string): Promise<ITask> {
        try {
           const switchDB = await connectDB(businessOwnerId);
            const result = await this.taskModel.findOneAndUpdate(
                { "employeeId": employeeId, "tasks._id": data.taskId },
                { $set: { "tasks.$.isCompleted": data.isCompleted } }, 
                { new: true } 
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

    async updateTaskApproval(data: any, taskId: string ,businessOwnerId:string): Promise<ITask | null> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            const result = await switchDB.model<ITask>("Task", this.taskModel.schema).findOneAndUpdate(
                { _id: taskId }, 
                { $set: { isApproved: data.isApproved } }, 
                { new: true }
            ).exec();
    
            if (!result) {
                throw new Error(`Task with ID ${taskId} not found or update failed`);
            }
            return result;
        } catch (error) {
            console.error("Error updating task approval:", error);
            throw new Error("Error updating task approval");
        }
    }
    
    
    async getTaskListOfEmployee(employeeId: string ,businessOwnerId:string): Promise<ITask[]> {
        try {
          const switchDB = await connectDB(businessOwnerId);
          const tasks = await switchDB.model<ITask>("Task", this.taskModel.schema).find({ employeeId: employeeId }).exec();
          return tasks;
        } catch (error) {
          console.error("Error fetching tasks by employee:", error);
          throw new Error("Could not retrieve tasks by employee");
        }
    }
    
    async updateCompletedTask(data: any, taskId: string ,businessOwnerId:string): Promise<ITask> {
        try {
            const subTaskId = data.taskId;  
            const switchDB = await connectDB(businessOwnerId);
            const result = await switchDB.model<ITask>("Task", this.taskModel.schema).findOneAndUpdate(
                { _id: taskId, "tasks._id": subTaskId },
                { 
                    $set: {
                        "tasks.$.taskStatus": data.taskStatus, 
                        "tasks.$.isCompleted": data.isCompleted,  
                        "tasks.$.response": data.response    
                    }
                }, 
                { new: true } 
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
    
    async getPreviousMonthCompletedTasks(employeeId: string ,businessOwnerId:string): Promise<number> {
        try {
            const now = new Date();
            const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            const switchDB = await connectDB(businessOwnerId);
            const taskCount = await switchDB.model<ITask>("Task", this.taskModel.schema).countDocuments({
                employeeId: employeeId,
                isApproved: true,
                dueDate: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth }
            }).exec();
    
            return taskCount;
        } catch (error) {
            console.error("Error fetching previous month completed tasks with approval:", error); 
            throw new Error("Could not retrieve previous month completed tasks with approval");
        }
    }

    async reassignTask(taskId: string, taskData: any,businessOwnerId:string): Promise<ITask> {
        try {
          const switchDB = await connectDB(businessOwnerId);
            const employee = await switchDB.model<IEmployee>("Employee", employeeModel.schema).findById(taskData.employeeId);
            if (!employee) {
                throw new Error(`Employee not found with ID: ${taskData.employeeId}`);
            }
    
            const result = await this.taskModel.findOneAndUpdate(
                { _id: taskId }, 
                { 
                    $set: { 
                        employeeId: taskData.employeeId, 
                        employeeName: employee.personalDetails.employeeName || "" 
                    } 
                },
                { new: true }
            ).exec();
    
            if (!result) {
                throw new Error(`Task with ID ${taskId} not found or update failed`);
            }
    
            console.log(`Updated task: ${JSON.stringify(result)}`);
    
            return result;
        } catch (error) {
            console.error("Error updating task approval:", error);
            throw new Error("Error updating task approval");
        }
    }

    async getTaskDashboardData(employeeId: string ,businessOwnerId:string): Promise<DashboardResponse> {
        try {
          const switchDB = await connectDB(businessOwnerId);
          const employeeObjectId = new mongoose.Types.ObjectId(employeeId);
          
          const currentDate = new Date();
          const twelveMonthsAgo = new Date();
          twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);
      
          const monthlyStats = await switchDB.model<ITask>("Task", this.taskModel.schema).aggregate<MonthlyAggregationResult>([
            {
              $match: {
                employeeId: employeeObjectId,
                createdAt: { $gte: twelveMonthsAgo }
              }
            },
            {
              $unwind: "$tasks"
            },
            {
              $group: {
                _id: {
                  month: { $month: "$createdAt" },
                  year: { $year: "$createdAt" },
                  status: "$tasks.taskStatus"
                },
                count: { $sum: 1 },
                completedCount: {
                  $sum: {
                    $cond: [{ $eq: ["$tasks.isCompleted", true] }, 1, 0]
                  }
                }
              }
            },
            {
              $group: {
                _id: {
                  month: "$_id.month",
                  year: "$_id.year"
                },
                statusCounts: {
                  $push: {
                    status: "$_id.status",
                    count: "$count"
                  }
                },
                totalTasks: { $sum: "$count" },
                totalCompletedTasks: { $sum: "$completedCount" }
              }
            },
            {
              $sort: {
                "_id.year": 1,
                "_id.month": 1
              }
            }
          ]);
      
          const currentStats = await switchDB.model<ITask>("Task", this.taskModel.schema).aggregate<StatusAggregationResult>([
            {
              $match: {
                employeeId: employeeObjectId
              }
            },
            {
              $unwind: "$tasks"
            },
            {
              $group: {
                _id: "$tasks.taskStatus",
                count: { $sum: 1 },
                completedCount: {
                  $sum: {
                    $cond: [{ $eq: ["$tasks.isCompleted", true] }, 1, 0]
                  }
                }
              }
            }
          ]);
      
          const priorityStats = await switchDB.model<ITask>("Task", this.taskModel.schema).aggregate<TaskStatusCount>([
            {
              $match: {
                employeeId: employeeObjectId
              }
            },
            {
              $unwind: "$tasks"
            },
            {
              $group: {
                _id: "$tasks.priority",
                count: { $sum: 1 }
              }
            }
          ]);
      
          const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ];
      
          const monthlyData: MonthlyTaskData[] = monthlyStats.map(stat => ({
            month: `${monthNames[stat._id.month - 1]} ${stat._id.year}`,
            completed: stat.statusCounts.find(s => s.status === "completed")?.count || 0,
            inProgress: stat.statusCounts.find(s => s.status === "inProgress")?.count || 0,
            backlog: stat.statusCounts.find(s => s.status === "backlog")?.count || 0,
            blocked: stat.statusCounts.find(s => s.status === "blocked")?.count || 0,
            total: stat.totalTasks,
            totalCompleted: stat.totalCompletedTasks
          }));
      
          const currentTaskStats: TaskStats = {
            completed: currentStats.find(s => s._id === "completed")?.count || 0,
            inProgress: currentStats.find(s => s._id === "inProgress")?.count || 0,
            backlog: currentStats.find(s => s._id === "backlog")?.count || 0,
            blocked: currentStats.find(s => s._id === "blocked")?.count || 0,
            codeReview: currentStats.find(s => s._id === "codeReview")?.count || 0,
            qaTesting: currentStats.find(s => s._id === "qaTesting")?.count || 0,
            deployed: currentStats.find(s => s._id === "deployed")?.count || 0,
            approved: currentStats.find(s => s._id === "approved")?.count || 0
          };
      
          const taskPriorities: TaskPriorities = {
            high: priorityStats.find(p => p._id === "high")?.count || 0,
            medium: priorityStats.find(p => p._id === "medium")?.count || 0,
            low: priorityStats.find(p => p._id === "low")?.count || 0
          };
      
          const employeeDetails = await switchDB.model<IEmployee>("Employee", employeeModel.schema).findOne({ employeeId })
            .select('employeeName profilePicture')
            .lean();
      
          const totalCompletedTasks = currentStats.reduce((sum, stat) => 
            sum + (stat.completedCount || 0), 0);
      
          return {
            employee: {
              name: employeeDetails?.personalDetails?.employeeName,
              profilePicture: employeeDetails?.personalDetails?.profilePicture ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employeeDetails?.personalDetails?.profilePicture}` : employeeDetails?.personalDetails?.profilePicture
            },
            monthlyTaskData: monthlyData,
            currentTaskStats,
            taskPriorities,
            totalTasks: Object.values(currentTaskStats).reduce((a, b) => a + b, 0),
            totalCompletedTasks,
            lastUpdated: new Date()
          };
      
        } catch (error: any) {
          throw new Error(`Error in repository layer: ${error.message}`);
        }
      }
      
      
    
    
}
