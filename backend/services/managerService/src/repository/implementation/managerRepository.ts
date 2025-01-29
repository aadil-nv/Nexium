import { inject, injectable } from "inversify";
import IBaseRepository from "../interface/IBaseRepository";
import IManagerRepository from "../interface/IManagerRepository";
import {IManager} from "../../entities/managerEntities";
import BaseRepository from "../../repository/implementation/baseRepository";
import { Model } from "mongoose";
import managerModel from "../../models/managerModel";
import attendanceModel from "../../models/attendanceModel";
import employeeModel from "../../models/employeeModel";
import taskModel from "../../models/taskModel";
import moment from "moment";
import departmentModel from "../../models/departmentModel";



@injectable()
export default class ManagerRepository extends BaseRepository<IManager> implements IManagerRepository{
    constructor(@inject("managerModel") managerModel: Model<IManager>) {
        super(managerModel);
    }

    async getManagers(): Promise<IManager[]> {
        try {   
            return await managerModel.find();  
        } catch (error) {
            console.log("Error finding documents:", error);
            return []; 
        }
    }

    async updateManagerPersonalInfo(managerId: string, data: any): Promise<IManager | null> {
        console.log("Updating manager personal info in repository layer:", managerId, data);
      
        try {
          const manager = await managerModel.findById(managerId);
      
          if (!manager) {
            console.error("Manager not found");
            return null;
          }
      
          // Merge new personal details into existing details
          manager.personalDetails = {
            ...manager.personalDetails, // Directly merge the existing details
            ...data, // Assuming `data` contains the updated personal details
          };
      
          await manager.save();
      
          return manager;
        } catch (error) {
          console.error("Error updating manager personal info:", error);
          return null;
        }
      }

      async findIsBlocked(managerId: string): Promise<boolean | null> {

  
        
        try {
          const manager = await managerModel.findById(managerId);
      
          
          if (!manager) {
            return null; // Return null if no manager is found
          }
          return manager.isBlocked ?? null; // Return isBlocked status or null if not available
        } catch (error) {
          console.error("Error finding manager by ID:", error);
          return null; // Return null in case of any error
        }
      }
      

      async getDetails(managerId: string): Promise<any> {
        try {
            const manager = await managerModel.findById(managerId);
            return manager;
        } catch (error) {
            console.error("Error finding manager by ID:", error);
            return null;
        }
    }

    async uploadProfilePicture(managerId: string, filePath: string): Promise<IManager> {
      console.log("Data received:-->>>>>>", filePath);
      
      try {
        const result = await managerModel.findByIdAndUpdate(
          managerId,
          { $set: { 'personalDetails.profilePicture': filePath } }, // Save the file path
          { new: true }
        );
    
        if (!result) {
          throw new Error(`No business owner found with ID: ${managerId}`);
        }
    
        return result;
      } catch (error) {
        console.error('Error updating personal details:', error);
        throw new Error('Could not update personal details.');
      }
    }

    async getLeaveEmployees(managerId: string): Promise<any> {
      try {
        // Use aggregation to find employees with non-null leaveStatus
        const result = await attendanceModel.aggregate([
          {
            $match: {
              'attendance.leaveStatus': { $ne: "null" }, // Filter attendance entries with leaveStatus !== "null"
            },
          },
          {
            $lookup: {
              from: 'employees', // Reference to the Employee collection
              localField: 'employeeId',
              foreignField: '_id',
              as: 'employeeDetails', // Attach employee details
            },
          },
          {
            $project: {
              employeeId: 1,
              employeeDetails: { name: 1, email: 1 }, // Customize fields if needed
              attendance: {
                $filter: {
                  input: '$attendance',
                  as: 'entry',
                  cond: { $ne: ['$$entry.leaveStatus', "null"] },
                },
              },
            },
          },
        ]);
    
        return result;
      } catch (error:any) {
        console.error("Error in getLeaveEmployees:", error.message);
        throw new Error("Error retrieving leave employees");
      }
    }
  
    async updateManagerAddress(managerId: string, data: any): Promise<any> {

      console.log("Updating manager address in repository layer:", managerId, data);
      try {
        const result = await managerModel.findOneAndUpdate({_id: managerId }, { $set: { address: data } }, { new: true });
        
        if (!result) {
          throw new Error(`No manager found with ID: ${managerId}`);
        }
        return result;
      } catch (error :any) {
        console.error("Error in updateManagerAddress:", error.message);
        throw new Error("Error updating manager address");
      }
    }

    async uploadDocuments(managerId: string, documentType: string, documentData: Object): Promise<IManager> {

  
      try {
        // Validate document type
        if (documentType !== 'resume') {
          throw new Error(`Invalid document type: ${documentType}`);
        }
    
        // Construct the update data based on documentType
        const updateData = {
          [`documents.${documentType}`]: documentData
        };
    
        const result = await managerModel.findByIdAndUpdate(
          managerId,
          updateData,
          { new: true }
        );
    
        if (!result) throw new Error(`No business owner found with ID: ${managerId}`);
  
        return result;
      } catch (error) {
        console.error('Error updating documents:', error);
        throw new Error('Could not update documents.');
      }
    }

    async getDashboardData(managerId: string): Promise<any> {
      try {
        // Fetch data
        const employees = await employeeModel.find({ managerId }).select('_id').lean();
        const departments = await departmentModel.find().lean();
        const tasks = await taskModel.find({ employeeId: { $in: employees.map((e) => e._id) } }).lean();
    
        // Counts
        const employeeCount = employees.length;
        const departmentCount = departments.length;
        const taskCount = tasks.reduce((acc, task) => acc + task.tasks.length, 0);
        const completedTaskCount = tasks.reduce(
          (acc, task) => acc + task.tasks.filter((t) => t.isCompleted).length,
          0
        );
    
        // Area chart data: Number of completed tasks by department
        const departmentTaskData = departments.map((department) => {
          const taskCount = department.employees.reduce((count, employee) => {
            const employeeTasks = tasks.filter((task) => String(task.employeeId) === String(employee.employeeId));
            const completedTasks = employeeTasks.reduce(
              (acc, task) => acc + task.tasks.filter((t) => t.isCompleted).length,
              0
            );
            return count + completedTasks;
          }, 0);
          return { department: department.departmentName, completedTasks: taskCount };
        });
    
        // Area chart data: Tasks by month with full month name
        const tasksByMonth = tasks.reduce<{ [key: string]: number }>((acc, task) => {
          task.tasks.forEach((t) => {
            if (t.isCompleted) {
              const month = moment(task.createdAt).format("MMMM YYYY"); // Format as full month name and year
              acc[month] = (acc[month] || 0) + 1;
            }
          });
          return acc;
        }, {});
    
        const tasksOverTimeData = Object.keys(tasksByMonth).map((month) => ({
          month,
          completedTasks: tasksByMonth[month],
        }));
    
        // Return dashboard data
        return {
          employeeCount,
          departmentCount,
          taskCount,
          completedTaskCount,
          areaChartData: {
            departmentTaskData,
            tasksOverTimeData,
          },
        };
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw new Error("Failed to fetch dashboard data");
      }
    }
    
      
}