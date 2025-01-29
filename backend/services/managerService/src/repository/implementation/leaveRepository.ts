import { injectable, inject } from "inversify";
import ILeaveRepository from "../interface/ILeaveRepository";
import mongoose, { Model } from "mongoose";
import employeeAttendanceModel from "../../models/attendanceModel";
import { IEmployeeAttendance } from "../../entities/attendanceEntities";
import BaseRepository from "./baseRepository";
import employeeModel from '../../models/employeeModel';
import leaveTypeModel from "../../models/leaveTypeModel";
import { ILeaveType} from "../../entities/leaveTypeEntities";
import { IEmployeeLeave } from "../../entities/employeeLeaveEntities";
import employeeLeaveModel from "../../models/employeeLeaveModel";
import IEmployee from "../../entities/employeeEntities";
import { IAppliedLeave } from "entities/appliedLeaveEntities";

@injectable()
export default class LeaveRepository extends BaseRepository<IEmployeeAttendance> implements ILeaveRepository {

    constructor(@inject("IEmployeeAttendance") 
    private employeeAttendanceModel: Model<IEmployeeAttendance>,
    @inject("IEmployeeLeave")
    private employeeLeaveModel: Model<IEmployeeLeave>,
    @inject("IAppliedLeave")
    private appliedLeaveModel:Model<IAppliedLeave>) {
        super(employeeAttendanceModel);
    }

    async updateLeaveApproval(employeeId: string, data: any): Promise<IEmployeeAttendance | null> {
        console.log("data!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", data);
        console.log("employeeId", employeeId);
    
        try {
            const formattedDate = new Date(data.date).toISOString().split('T')[0];
    
            const employeeAttendance = await this.employeeAttendanceModel.findOne({ employeeId });
            if (!employeeAttendance) {
                throw new Error("Employee attendance not found");
            }
    
            const attendanceEntry = employeeAttendance.attendance.find(entry => entry.date === formattedDate);
            if (!attendanceEntry) {
                throw new Error("Attendance entry for the specified date not found");
            }
    
            const leaveField = data.leaveType as keyof IEmployeeLeave;
    
            const leaveRecord = await this.employeeLeaveModel.findOne({ employeeId });
            if (!leaveRecord) {
                throw new Error("Employee leave record not found");
            }
    
            const currentLeaveCount = leaveRecord[leaveField] || 0;
    
            // Determine the leave duration (full or half) and adjust accordingly
            let leaveDuration = 1; // Default to full leave
            if (data.duration === "half") {
                leaveDuration = 0.5; // Adjust to half leave if "half" is specified
            }
    
            if (data.action === "Approved" && attendanceEntry.leaveStatus === "Pending") {
                if (currentLeaveCount < leaveDuration) {
                    throw new Error(`Not enough ${leaveField} leaves available to approve`);
                }
                attendanceEntry.leaveStatus = "Approved";
                await this.employeeLeaveModel.findOneAndUpdate(
                    { employeeId },
                    { $inc: { [leaveField]: -leaveDuration } } // Decrease by the leaveDuration (1 or 0.5)
                );
            } else if (data.action === "Rejected" && attendanceEntry.leaveStatus === "Pending") {
                attendanceEntry.leaveStatus = "Rejected";
                attendanceEntry.rejectionReason = data.reason;
            } else if (attendanceEntry.leaveStatus === "Rejected" && data.action === "Approved") {
                if (currentLeaveCount < leaveDuration) {
                    throw new Error(`Not enough ${leaveField} leaves available to approve`);
                }
                attendanceEntry.leaveStatus = "Approved";
                await this.employeeLeaveModel.findOneAndUpdate(
                    { employeeId },
                    { $inc: { [leaveField]: -leaveDuration } } // Decrease by the leaveDuration (1 or 0.5)
                );
            } else if (attendanceEntry.leaveStatus == "Approved" && data.action == "Rejected") {
                console.log(`Reverting approved leave for ${leaveField}, incrementing leave count=========`.bgYellow);
                attendanceEntry.leaveStatus = "Rejected";
                attendanceEntry.rejectionReason = data.reason;
                const updateResult = await this.employeeLeaveModel.findOneAndUpdate(
                    { employeeId },
                    { $inc: { [leaveField]: leaveDuration } } // Increase by the leaveDuration (1 or 0.5)
                );
    
                console.log(`Leave increment result:`, updateResult);
            }
    
            // Save the updated attendance
            const result = await employeeAttendance.save();
    
            return result;
        } catch (error: any) {
            console.error("Error in updateLeaveApproval repository:", error.message);
            throw new Error(error.message);
        }
    }
    
    
    
    async getAllLeaveEmployees(): Promise<any> {
        try {
            // Fetch employees with valid leave status
            const results = await this.employeeAttendanceModel
                .find({
                    "attendance.leaveStatus": { 
                        $in: ["Pending", "Approved", "Rejected"],
                        $exists: true // Ensure the field exists and is not undefined
                    }
                })


            const filteredResults = results.map(employee => {
                // Filter attendance where leaveStatus is not null, undefined, or "null" string
                const filteredAttendance = employee.attendance.filter(attendance => 
                    attendance.leaveStatus && attendance.leaveStatus !== "null"
                );
    
                // Return employee data with filtered attendance
                return { ...employee.toObject(), attendance: filteredAttendance };
            });
    
            // Check if any valid results were found
            if (filteredResults.length === 0) {
                throw new Error("No leave employees found with valid leave status");
            }
    
            return filteredResults;
        } catch (error) {
            console.error("Error in getAllLeaveEmployees repository:", error);
            throw new Error("Failed to fetch leave employees");
        }
    }
    
    
    
    async findAllLeaveTypes(): Promise<ILeaveType> {
        try {
            // Use Mongoose's `findOne()` to retrieve the first leave types document
            let leaveTypesDoc = await leaveTypeModel.findOne();
    
            if (!leaveTypesDoc) {
                // If no document exists, create a new one with default leave type values set to 0
                const newLeaveTypesDoc = await leaveTypeModel.create({
                    sickLeave: 0,        // Default max days for Sick Leave
                    casualLeave: 0,      // Default max days for Casual Leave
                    maternityLeave: 0,   // Default max days for Maternity Leave
                    paternityLeave: 0,   // Default max days for Paternity Leave
                    paidLeave: 0,        // Default max days for Paid Leave
                    unpaidLeave: 0,      // Default max days for Unpaid Leave
                    compensatoryLeave: 0, // Default max days for Compensatory Leave
                    bereavementLeave: 0,  // Default max days for Bereavement Leave
                    marriageLeave: 0,     // Default max days for Marriage Leave
                    studyLeave: 0,        // Default max days for Study Leave
                });
    
                // Return the newly created document
                return newLeaveTypesDoc;
            }
    
            // If a document exists, return it
            return leaveTypesDoc;
        } catch (error) {
            console.error("Error in findAllLeaveTypes repository:", error);
            throw new Error("Failed to fetch leave types");
        }
    }
    
    
    

    async updateLeaveTypes(leaveTypeId: string, data: Partial<ILeaveType>): Promise<ILeaveType> {
        try {
            // Find the leave types document by ID
            const leaveTypesDoc = await leaveTypeModel.findOne();
    
            if (!leaveTypesDoc) {
                throw new Error('Leave types document not found');
            }
    
            // Update the corresponding leave type field with new data
            if (data.sickLeave !== undefined) leaveTypesDoc.sickLeave = data.sickLeave;
            if (data.casualLeave !== undefined) leaveTypesDoc.casualLeave = data.casualLeave;
            if (data.maternityLeave !== undefined) leaveTypesDoc.maternityLeave = data.maternityLeave;
            if (data.paternityLeave !== undefined) leaveTypesDoc.paternityLeave = data.paternityLeave;
            if (data.paidLeave !== undefined) leaveTypesDoc.paidLeave = data.paidLeave;
            if (data.unpaidLeave !== undefined) leaveTypesDoc.unpaidLeave = data.unpaidLeave;
            if (data.compensatoryLeave !== undefined) leaveTypesDoc.compensatoryLeave = data.compensatoryLeave;
            if (data.bereavementLeave !== undefined) leaveTypesDoc.bereavementLeave = data.bereavementLeave;
            if (data.marriageLeave !== undefined) leaveTypesDoc.marriageLeave = data.marriageLeave;
            if (data.studyLeave !== undefined) leaveTypesDoc.studyLeave = data.studyLeave;
    
            // Save the updated document
            const updatedResult = await leaveTypesDoc.save();
    
            // Return the updated leave type document
            return updatedResult;
        } catch (error: any) {
            console.error("Error in updateLeaveTypes repository:", error);
            throw new Error("Failed to update leave types");
        }
    }
    
    async getEmployeeLeaves(employeeId: string): Promise<IEmployeeLeave> {
        try {
            // Use Mongoose's `findOne()` to retrieve the leave employee document
            const leaveEmployeeDoc = await employeeLeaveModel.findOne({ employeeId });
    
            if (!leaveEmployeeDoc) {
                throw new Error('Leave employee document not found');
            }
    
            // Return the leave employee document
            return leaveEmployeeDoc;
        } catch (error) {
            console.error("Error in getEmployeeLeaves repository:", error);
            throw new Error("Failed to fetch leave employee");
        }
    }
    
    async fetchAllPreAppliedLeaves(): Promise<IAppliedLeave[]> {
        try {
          // Fetch all pre-applied leaves from the database
          const preAppliedLeaves = await this.appliedLeaveModel.find().populate({
            path: 'employeeId',
            select: 'personalDetails', // Only select `personalDetails`
          });
    
          // Check if no pre-applied leaves are found and throw an error
          if (!preAppliedLeaves || preAppliedLeaves.length === 0) {
            throw new Error('No pre-applied leaves found');
          }
    
          // Return the list of pre-applied leaves
          return preAppliedLeaves;
        } catch (error) {
          // Improved error handling and logging
          console.error("Error fetching pre-applied leaves:", error);
          throw new Error('Failed to fetch pre-applied leaves');
        }
      }

      async updatePreAppliedLeaves(employeeId: string, managerName: string, data: any): Promise<IAppliedLeave | null> {

        console.log("Manager name is:", managerName);
        console.log("Data is$$$$$$$$$$$$$$$$$$$$:", data);

        
        try {
            const employeeLeaveData:any = await this.employeeLeaveModel.findOne({ employeeId });
            if (!employeeLeaveData) throw new Error('Employee leave data not found');
            
            const appliedLeaveData: any = await this.appliedLeaveModel.findById(data.leaveId);
            if (!appliedLeaveData) throw new Error('Leave not found or update failed');
    
            // Process if approved and status is pending
            if (data.action === 'approved' && appliedLeaveData.status === 'pending') {
                Object.assign(appliedLeaveData, {
                    status: 'approved',
                    approvedBy: managerName,
                    approvedDate: new Date().toISOString()
                });
    
                const { leaveType, duration } = appliedLeaveData;
                if (employeeLeaveData[leaveType] !== undefined) {
                    employeeLeaveData[leaveType] -= duration;
                    await employeeLeaveData.save();
                } else {
                    throw new Error('Invalid leave type');
                }
                await appliedLeaveData.save();
            }else if (data.action === 'rejected' && appliedLeaveData.status === 'pending'){
                Object.assign(appliedLeaveData, {
                    status: 'rejected',
                    rejectedBy: managerName,
                    rejectedDate: new Date().toISOString(),
                    rejectionReason: data.rejectionReason
                });
                await appliedLeaveData.save();
            }else if (data.action === 'rejected' && appliedLeaveData.status === 'approved'){
                Object.assign(appliedLeaveData, {
                    status: 'rejected',
                    rejectedBy: managerName,
                    rejectedDate: new Date().toISOString(),
                    rejectionReason: data.rejectionReason
                });
                const { leaveType, duration } = appliedLeaveData;
                if (employeeLeaveData[leaveType] !== undefined) {
                    employeeLeaveData[leaveType] += duration;
                    await employeeLeaveData.save();
                } else {
                    throw new Error('Invalid leave type');
                }
                await appliedLeaveData.save();
            }else if (data.action === 'approved' && appliedLeaveData.status === 'rejected'){
                Object.assign(appliedLeaveData, {
                    status: 'approved',
                    approvedBy: managerName,
                    approvedDate: new Date().toISOString(),
                    rejectionReason: data.rejectionReason

                });
                const { leaveType, duration } = appliedLeaveData;
                if (employeeLeaveData[leaveType] !== undefined) {
                    employeeLeaveData[leaveType] -= duration;
                    await employeeLeaveData.save();
                } else {
                    throw new Error('Invalid leave type');
                }
                await appliedLeaveData.save();
            }
            
            return appliedLeaveData;
    
        } catch (error) {
            console.error('Error updating leave in repository:', error);
            throw new Error('Failed to update leave details');
        }
    }
    
    
    
    
    
    

}