import { inject, injectable } from "inversify";
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
import connectDB from "../../config/connectDB";
import IEmployee from "../../entities/employeeEntities";
import IDepartment from "../../entities/departmentEntities";
import { ITask } from "../../entities/taskEntities";
import { IEmployeeAttendance } from "entities/attendanceEntities";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntity";
import businessOwnerModel from "../../models/businessOwnerModel";
import ISubscription from "entities/subscriptionEntity";
import SubscriptionNodel from "../../models/subscriptionModel";




@injectable()
export default class ManagerRepository extends BaseRepository<IManager> implements IManagerRepository{
    constructor(@inject("managerModel") managerModel: Model<IManager>) {
        super(managerModel);
    }

    async getManagers(businessOwnerId: string): Promise<IManager[]> {
        try {   
            const db = await connectDB(businessOwnerId);
            return await db.model<IManager>("managers", managerModel.schema).find();  
        } catch (error) {
            console.log("Error finding documents:", error);
            return []; 
        }
    }

    async updateManagerPersonalInfo(managerId: string, data: any ,businessOwnerId: string): Promise<IManager | null> {
      
        try {
          const db = await connectDB(businessOwnerId);
          const manager = await db.model<IManager>("managers", managerModel.schema).findById(managerId);
      
          if (!manager) {
            console.error("Manager not found");
            return null;
          }
      
          manager.personalDetails = {
            ...manager.personalDetails, 
            ...data, 
          };
      
          await manager.save();
      
          return manager;
        } catch (error) {
          console.error("Error updating manager personal info:", error);
          return null;
        }
      }

      async findIsBlocked(managerId: string,businessOwnerId: string): Promise<boolean | null> {
        try {
          const db = await connectDB(businessOwnerId);
          const manager = await db.model<IManager>("managers", managerModel.schema).findById(managerId);
          
          if (!manager) {
            return null; 
          }
          return manager.isBlocked ?? null;
        } catch (error) {
          console.error("Error finding manager by ID:121212", error);
          return null; 
        }
      }
      async findBusinessOwnerIsBlocked(managerId: string, businessOwnerId: string): Promise<boolean | null> {
        try {
          const db = await connectDB(businessOwnerId);
          const businessOwner = await db
            .model<IBusinessOwnerDocument>("businessowners", businessOwnerModel.schema)
            .findById(businessOwnerId)
      
          if (!businessOwner || !businessOwner._id) {
            return null;
          }
      
          return businessOwner.isBlocked ?? null; // Cast to `any` to avoid TypeScript errors
        } catch (error) {
          console.error("Error finding manager by ID:", error);
          return null;
        }
      }
      
      

      async getDetails(managerId: string, businessOwnerId: string): Promise<IManager | null> {
        try {
            const db = await connectDB(businessOwnerId);
            const manager = await db.model<IManager>("managers", managerModel.schema).findById(managerId);

            return manager; 
        } catch (error) {
            console.error("Error finding manager by ID:", error);
            return null;
        }
    }

    async uploadProfilePicture(managerId: string, filePath: string ,businessOwnerId: string): Promise<IManager> {
      
      try {
        const db = await connectDB(businessOwnerId);
        const result = await db.model<IManager>("managers", managerModel.schema).findByIdAndUpdate(
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

    async getLeaveEmployees(managerId: string ,businessOwnerId: string): Promise<any> {
      try {
        const db = await connectDB(businessOwnerId);
        const result = await db.model<IEmployeeAttendance>("EmployeeAttendance", attendanceModel.schema).aggregate([
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
  
    async updateManagerAddress(managerId: string, data: any ,businessOwnerId: string): Promise<any> {

      try {
        const db = await connectDB(businessOwnerId);
        const result = await db.model<IManager>("managers", managerModel.schema).findOneAndUpdate({_id: managerId }, { $set: { address: data } }, { new: true });
        
        if (!result) {
          throw new Error(`No manager found with ID: ${managerId}`);
        }
        return result;
      } catch (error :any) {
        console.error("Error in updateManagerAddress:", error.message);
        throw new Error("Error updating manager address");
      }
    }

    async uploadDocuments(managerId: string, documentType: string, documentData: Object ,businessOwnerId: string): Promise<IManager> {
      try {
        const db = await connectDB(businessOwnerId);
        if (documentType !== 'resume') {
          throw new Error(`Invalid document type: ${documentType}`);
        }
    
        // Construct the update data based on documentType
        const updateData = {
          [`documents.${documentType}`]: documentData
        };
    
        const result = await db.model<IManager>("managers", managerModel.schema).findByIdAndUpdate(
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

    async getDashboardData(managerId: string ,businessOwnerId: string): Promise<any> {
      try {
        const db = await connectDB(businessOwnerId); 
         db.model<IManager>("managers", managerModel.schema)
        const employees = await db.model<IEmployee>("employees", employeeModel.schema).find({ managerId }).select('_id').lean();
        const departments = await db.model<IDepartment>("departments", departmentModel.schema).find().lean();
        const tasks = await db.model<ITask>("tasks", taskModel.schema).find({ employeeId: { $in: employees.map((e) => e._id) } }).lean();
    
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

    async updateManagerIsActive(managerId: string, isActive: boolean ,businessOwnerId: string): Promise<any> {

      try {
        const db = await connectDB(businessOwnerId);
        const result = await db.model<IManager>("managers", managerModel.schema).findOneAndUpdate({_id: managerId }, { $set: { isActive: isActive } }, { new: true });
        
        if (!result) {
          throw new Error(`No manager found with ID: ${managerId}`);
        }
        return result;
      } catch (error :any) {
        console.error("Error in updateManagerIsActive:", error.message);
        throw new Error("Error updating manager isActive");
      }
    }

    async findManager(managerId: string, businessOwnerId: string): Promise<IManager | null> {

      try {
        const db = await connectDB(businessOwnerId);
        const result = await db.model<IManager>("managers", managerModel.schema).findOne({ _id: managerId });
        return result;
      } catch (error :any) {
        console.error("Error in findManager:", error.message);
        throw new Error("Error finding manager");
    }
  }

  async findAllManagers(businessOwnerId: string): Promise<IManager[]> {

    try {
      const db = await connectDB(businessOwnerId);
      const result = await db.model<IManager>("managers", managerModel.schema).find();
      return result;
    } catch (error :any) {
      console.error("Error in findAllManagers:", error.message);
      throw new Error("Error finding managers");
    }
  }

  async checkSubscriptionEmployee(businessOwnerId: string): Promise<boolean> {
    try {
      const db = await connectDB(businessOwnerId);
            const employee = db.model<IEmployee>("Employee", employeeModel.schema);
            const businessOwner = db.model<IBusinessOwnerDocument>("BusinessOwner", businessOwnerModel.schema);
            const subscription = db.model<ISubscription>("Subscription", SubscriptionNodel.schema);
            const subscriptionData = await subscription.find();
            console.log("subscriptionData================>",subscriptionData);
            
            const businessOwnerData = await businessOwner
            .findOne({ _id: businessOwnerId })
            .populate<{ subscription : ISubscription }>('subscription');
            //   path: "subscription.subscriptionId",
            //   model: Subscription, // Explicitly specify the model
            // });
        console.log(`businessOwnerData: ====>`.bgWhite.bold,businessOwnerData);
        
  
      if (!businessOwnerData) {
        throw new Error(`No business owner found with ID: ${businessOwnerId}`);
      }
  
      // const subscription = businessOwnerData.subscription?.subscriptionId as ISubscription;
      // console.log(`subscription: ${subscription}`.bgWhite.bold);
      
  
      // if (!subscription) {
      //   throw new Error(`Subscription not found for business owner: ${businessOwnerId}`);
      // }
  
      const employeeCount = await employee.countDocuments({ businessOwnerId });
      console.log(`Employee count: ${employeeCount}`.bgWhite.bold);
      
      
  
      // const allowedEmployees= subscription.serviceRequestCount ?? null;
  
      // if (allowedEmployees !== null && employeeCount >= allowedEmployees) {
      //   return false;
      // }
  
      return true; // Business owner is within the limit
    } catch (error) {
      console.error("Error checking subscription repo:", error);
      throw new Error("Failed to check subscription repo.");
    }
  }
      
}