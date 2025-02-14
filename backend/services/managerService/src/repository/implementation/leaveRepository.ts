import { injectable, inject } from "inversify";
import ILeaveRepository from "../interface/ILeaveRepository";
import { Model } from "mongoose";
import { IEmployeeAttendance } from "../../entities/attendanceEntities";
import BaseRepository from "./baseRepository";
import leaveTypeModel from "../../models/leaveTypeModel";
import { ILeaveType} from "../../entities/leaveTypeEntities";
import { IEmployeeLeave } from "../../entities/employeeLeaveEntities";
import { IAppliedLeave } from "entities/appliedLeaveEntities";
import connectDB from "../../config/connectDB";
import IEmployee from "../../entities/employeeEntities";


@injectable()
export default class LeaveRepository extends BaseRepository<IEmployeeAttendance> implements ILeaveRepository {

    constructor(@inject("IEmployeeAttendance") 
    private employeeAttendanceModel: Model<IEmployeeAttendance>,
    @inject("IEmployeeLeave")
    private employeeLeaveModel: Model<IEmployeeLeave>,
    @inject("EmployeeModel")
    private employeeModel: Model<IEmployee>,
    @inject("IAppliedLeave")
    private appliedLeaveModel:Model<IAppliedLeave>) {
        super(employeeAttendanceModel);
    }

    async updateLeaveApproval(employeeId: string, data: any, businessOwnerId: string): Promise<IEmployeeAttendance | null> {
        
        try {
            const db = await connectDB(businessOwnerId);
            const formattedDate = new Date(data.date).toISOString().split('T')[0];

            const employeeAttendance =  await db.model<IEmployeeAttendance>("EmployeeAttendance", this.employeeAttendanceModel.schema).findOne({ employeeId });
            if (!employeeAttendance) {
                throw new Error("Employee attendance not found");
            }

            const attendanceEntry = employeeAttendance.attendance.find(entry => entry.date === formattedDate);
            if (!attendanceEntry) {
                throw new Error("Attendance entry for the specified date not found");
            }

            const leaveField = data.leaveType as keyof IEmployeeLeave;

            const leaveRecord = await db.model<IEmployeeLeave>("EmployeeLeave" ,this.employeeLeaveModel.schema).findOne({ employeeId });
            if (!leaveRecord) {
                throw new Error("Employee leave record not found");
            }

            const currentLeaveCount = leaveRecord[leaveField] || 0;

          
            let leaveDuration = 1; 
            if (data.duration === "half") {
                leaveDuration = 0.5;
            }

            if (data.action === "Approved" && attendanceEntry.leaveStatus === "Pending") {
                if (currentLeaveCount < leaveDuration) {
                    throw new Error(`Not enough ${leaveField} leaves available to approve`);
                }
                attendanceEntry.leaveStatus = "Approved";
                await db.model<IEmployeeLeave>("EmployeeLeave" ,this.employeeLeaveModel.schema).findOneAndUpdate(
                    { employeeId },
                    { $inc: { [leaveField]: -leaveDuration } } 
                );
            } else if (data.action === "Rejected" && attendanceEntry.leaveStatus === "Pending") {
                attendanceEntry.leaveStatus = "Rejected";
                attendanceEntry.rejectionReason = data.reason;
            } else if (attendanceEntry.leaveStatus === "Rejected" && data.action === "Approved") {
                if (currentLeaveCount < leaveDuration) {
                    throw new Error(`Not enough ${leaveField} leaves available to approve`);
                }
                attendanceEntry.leaveStatus = "Approved";
                await db.model<IEmployeeLeave>("EmployeeLeave" ,this.employeeLeaveModel.schema).findOneAndUpdate(
                    { employeeId },
                    { $inc: { [leaveField]: -leaveDuration } } 
                );
            } else if (attendanceEntry.leaveStatus === "Approved" && data.action === "Rejected") {
                attendanceEntry.leaveStatus = "Rejected";
                attendanceEntry.rejectionReason = data.reason;
                const updateResult = await db.model<IEmployeeLeave>("EmployeeLeave",this.employeeLeaveModel.schema).findOneAndUpdate(
                    { employeeId },
                    { $inc: { [leaveField]: leaveDuration } }
                );
            }

            const result = await employeeAttendance.save();

            return result;
        } catch (error: any) {
            console.error("Error in updateLeaveApproval repository:", error.message);
            throw new Error(error.message);
        }
    }
    

    async getAllLeaveEmployees(buisinessownerId:string): Promise<any> {
        try {
            const db = await connectDB(buisinessownerId);
            const results = await db.model<IEmployeeAttendance>("EmployeeAttendance", this.employeeAttendanceModel.schema)
                .find({
                    "attendance.leaveStatus": { 
                        $in: ["Pending", "Approved", "Rejected"],
                        $exists: true // Ensure the field exists and is not undefined
                    }
                })


            const filteredResults = results.map(employee => {
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
    

    async findAllLeaveTypes(businessOwnerId: string): Promise<ILeaveType> {
        try {
            const db = await connectDB(businessOwnerId);
            const LeaveModel = db.model<ILeaveType>("LeaveTypes", leaveTypeModel.schema);
    
            let leaveTypesDoc = await LeaveModel.findOne(); 
    
            if (!leaveTypesDoc) {
                const newLeaveTypesDoc = new LeaveModel({
                    sickLeave: 0,      
                    casualLeave: 0,     
                    maternityLeave: 0,
                    paternityLeave: 0,   
                    paidLeave: 0,    
                    unpaidLeave: 0,   
                    compensatoryLeave: 0,
                    bereavementLeave: 0,  
                    marriageLeave: 0,  
                    studyLeave: 0        
                });
    
                await newLeaveTypesDoc.save(); // Save the document
                return newLeaveTypesDoc;
            }
    
            return leaveTypesDoc;
        } catch (error) {
            console.error("Error in findAllLeaveTypes repository:", error);
            throw new Error("Failed to fetch leave types");
        }
    }
    
    

    async updateLeaveTypes(leaveTypeId: string, data: Partial<ILeaveType> , businessOwnerId: string): Promise<ILeaveType> {
        try {
            const db = await connectDB(businessOwnerId);
            const leaveTypesDoc = await db.model<ILeaveType>("LeaveTypes", leaveTypeModel.schema).findById(leaveTypeId); 
    
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

    
    async getEmployeeLeaves(employeeId: string, businessOwnerId: string): Promise<IEmployeeLeave> {
        try {
            const db = await connectDB(businessOwnerId);
            const leaveEmployeeDoc = await db.model<IEmployeeLeave>("EmployeeLeave", this.employeeLeaveModel.schema).findOne({ employeeId });

            if (!leaveEmployeeDoc) {
                throw new Error('Leave employee document not found');
            }
            return leaveEmployeeDoc;
        } catch (error) {
            console.error("Error in getEmployeeLeaves repository:", error);
            throw new Error("Failed to fetch leave employee");
        }
    }
    

    async fetchAllPreAppliedLeaves(businessOwnerId: string): Promise<IAppliedLeave[]> {
     try {
    // Fetch all pre-applied leaves from the database
    const db = await connectDB(businessOwnerId);

    // Make sure the Employee model is registered
    const Employee = db.model<IEmployee>('Employee', this.employeeModel.schema); // Assuming employeeSchema is already defined

    const preAppliedLeaves = await db.model<IAppliedLeave>('AppliedLeave', this.appliedLeaveModel.schema)
      .find()
      .populate({
        path: 'employeeId',
        select: 'personalDetails', // Only select `personalDetails`
        model: Employee // Ensure you're using the correct model here
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


      async updatePreAppliedLeaves(employeeId: string, managerName: string, data: any , businessOwnerId: string): Promise<IAppliedLeave | null> {

        try {
            const db = await connectDB(businessOwnerId);
            const employeeLeaveData:any = await db.model<IEmployeeLeave>("EmployeeLeave" ,this.employeeLeaveModel.schema).findOne({ employeeId });
            if (!employeeLeaveData) throw new Error('Employee leave data not found');
            
            const appliedLeaveData: any = await  db.model<IAppliedLeave>('AppliedLeave', this.appliedLeaveModel.schema).findById(data.leaveId);
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