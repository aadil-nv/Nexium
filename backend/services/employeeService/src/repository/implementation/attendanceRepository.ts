import { IEmployeeAttendance , IAttendanceEntry} from "../../entities/attendanceEntities";
import IAttendanceRepository from "../../repository/interface/IAttendanceRepository";
import mongoose, { Model } from "mongoose";
import { inject, injectable } from "inversify";
import BaseRepository from "./baseRepository";
import  IEmployee  from "../../entities/employeeEntities";
import {  isSunday,format } from 'date-fns';
import { ObjectId } from "mongodb";
import { IEmployeeLeave } from "../../entities/employeeLeaveEntities";



@injectable()
export default class AttendanceRepository extends BaseRepository<IEmployeeAttendance> implements IAttendanceRepository {

    constructor(
        @inject("IEmployeeAttendance") private  _employeeAttendanceModel: Model<IEmployeeAttendance>,
        @inject("IEmployee") private  _employeeModel: Model<IEmployee> ,
        @inject("IEmployeeLeave") private  _employeeLeaveModel: Model<IEmployeeLeave>
    ) {
        super(_employeeAttendanceModel);
    }

    
    private generateDatesBetween(start: Date, end: Date): Date[] {
        const dates: Date[] = [];
        if (start > end) return dates;
        let currentDate = new Date(start);
        let endDate = new Date(end);

        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));  
            currentDate.setDate(currentDate.getDate() + 1);  
        }
        return dates;
    }
    
    async updateAttendances(employeeId: string): Promise<IEmployeeAttendance> {
        try {
            const employee = await this._employeeModel.findById(employeeId).select('professionalDetails.joiningDate');
            if (!employee) throw new Error("Employee not found");
    
            const { joiningDate } = employee.professionalDetails;
            const today = new Date();
            if (!joiningDate || joiningDate > today) throw new Error("Invalid joining date");
    
            const lastDay = new Date(today);
            lastDay.setDate(today.getDate() - 1);
    
            const allDates = this.generateDatesBetween(joiningDate, lastDay).filter(date => !isSunday(date));
    
            let attendanceDoc = await this._employeeAttendanceModel.findOne({ employeeId }) || new this._employeeAttendanceModel({ employeeId, attendance: [] });
            if (!attendanceDoc.isNew) await attendanceDoc.save();
    
            const attendanceDates = new Map(
                attendanceDoc.attendance.map(entry => [format(new Date(entry.date), 'yyyy-MM-dd'), entry])
            );
    
            const missingDates = allDates.filter(date => !attendanceDates.has(format(date, 'yyyy-MM-dd')));
            if (missingDates.length === 0) throw new Error("All attendance data is already available");
    
            const attendance: IAttendanceEntry[] = allDates.map(date => {
                const formattedDate = format(date, 'yyyy-MM-dd');
                const existingEntry = attendanceDates.get(formattedDate);
    
                // Ensure 'status' is one of the allowed values in IAttendanceEntry
                const status: "Present" | "Absent" | "Leave" | "Marked" |"Halfday" = 
                    !existingEntry && formattedDate === format(today, 'yyyy-MM-dd') ? "Present" : 
                    existingEntry?.status || "Absent";  // Default to "Absent" if no existing entry
    
                return {
                    date: formattedDate,
                    status,
                    checkInTime: null,
                    checkOutTime: null,
                    leaveType: null,
                    rejectionReason: null,
                    reason: null,
                    leaveStatus: null,
                    minutes: 0,
                };
            });
    
            attendanceDoc.attendance = attendance;
            return await attendanceDoc.save();
        } catch (error: any) {
            console.error("Error updating attendance:", error);
            throw new Error("Error updating attendance: " + error.message);
        }
    }
    
    async fetchAttendances(employeeId: string): Promise<IEmployeeAttendance> {
        try {
            const attendances = await this._employeeAttendanceModel.findOne({ employeeId: new ObjectId(employeeId) })
                .select('attendance employeeId')
                .lean();  // Return a plain JavaScript object
            
            if (!attendances) {
                throw new Error(`No attendance records found for employee ID ${employeeId}`);
            }
    
            // Ensure attendance is correctly typed and sorted by date
            attendances.attendance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
            // Make sure the status is one of the expected values
            attendances.attendance = attendances.attendance.map(entry => ({
                ...entry,
                status: ["Present", "Absent", "Leave", "Marked" ,"Halfday"].includes(entry.status) ? entry.status : "Absent"  // Default to "Absent"
            }));
    
            return attendances as IEmployeeAttendance;  // Cast to the correct type
        } catch (error: any) {
            console.error("Error fetching attendances:", error);
            throw new Error("Error fetching attendances: " + error.message);
        }
    }
    

    async findAttendanceByEmployeeId(employeeId: string): Promise<any> {


        try {
            return await this._employeeAttendanceModel.findOne({ employeeId });
        } catch (error) {
            console.error("Error finding attendance by employee ID:", error);
            return { error: "Internal server error" };
        }
    }

    async createAttendanceRecord(employeeId: string): Promise<any> {

        try {
            const newAttendance = new this._employeeAttendanceModel({ employeeId, attendance: [] });

            return await newAttendance.save();
        } catch (error) {
            console.error("Error creating attendance record:", error);
            return { error: "Internal server error" };
        }
    }


    async markCheckIn(id: string, updateData: any, employeeId: string): Promise<any> {
        try {

            const newAttendanceEntry = {
                date: updateData.date, // Ensure this is a valid date string
                checkInTime: updateData.checkInTime,
                checkOutTime: updateData.checkOutTime,
                hours: updateData.minutes,
                status: updateData.status,
                leaveStatus: updateData.leaveStatus,
                leaveType: updateData.leaveType,
                reason: updateData.reason,
                rejectionReason: updateData.rejectionReason
            };

            const updatedEmployeeAttendance = await this._employeeAttendanceModel.findByIdAndUpdate(
                { _id: id },
                { $push: { attendance: newAttendanceEntry } },
                { new: true }
            );
    
            if (!updatedEmployeeAttendance) {
                throw new Error('Employee attendance record not found');
            }
            await this._employeeModel.findByIdAndUpdate(
                employeeId, // Pass the ID directly
                { $set: { isActive: true } } // Update object with the correct MongoDB syntax
              );
              

            return updatedEmployeeAttendance;
        } catch (error) {
            console.error('Error updating attendance:', error);
            throw error;
        }
    }

    async findEmployeeById(employeeId: string): Promise<IEmployee> {
        try {
            const employee = await this._employeeModel
              .findOne({ _id: employeeId })
              .select({ password: 0 })
              .exec();
      
            if (!employee) {
              throw new Error("Employee not found");
            }
      
            return employee;
          } catch (error: any) {
            throw new Error("Error fetching employee profile: " + error.message);
          }
    }

    async applyLeave(employeeId: string, leaveData: any): Promise<any> {
        try {
            const { attendanceId, leaveType, reason,date } = leaveData;
    
            const employeeAttendance = await this._employeeAttendanceModel.findOne({ employeeId });
    
            if (!employeeAttendance || !employeeAttendance.attendance) {
                throw new Error("Employee attendance not found");
            }
    
            const dayOfLeave = employeeAttendance.attendance.find(
                (attendance) => attendance.date === date 
            );
  
            if (!dayOfLeave || !dayOfLeave.date) { 
                throw new Error("Attendance record not found or missing _id");
            }
    
            dayOfLeave.leaveType = leaveType || null;
            dayOfLeave.reason = reason || null;
            dayOfLeave.leaveStatus = "Pending"; 

            await employeeAttendance.save();
    
            return employeeAttendance; 
        } catch (error: any) {
            console.error("Error applying leave:", error);
            throw new Error("Error applying leave: " + error.message);
        }
    }

    async markCheckOut(id: string, updateData: any, employeeId: string): Promise<any> {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid ObjectId');
            }

            const updatedEmployeeAttendance = await this._employeeAttendanceModel.findOneAndUpdate(
                { _id: id, "attendance.date": updateData.date }, 
                {
                    $set: {
                        "attendance.$.checkOutTime": updateData.checkOutTime,
                        "attendance.$.minutes": updateData.minutes,
                        "attendance.$.status": updateData.status,
                        "attendance.$.leaveStatus": updateData.leaveStatus,
                        "attendance.$.leaveType": updateData.leaveType,
                        "attendance.$.reason": updateData.reason,
                        "attendance.$.rejectionReason": updateData.rejectionReason,
                    },
                },
                { new: true } 
            );
    
            if (!updatedEmployeeAttendance) {
                throw new Error('Employee attendance record not found or no matching attendance entry found');
            }
            await this._employeeModel.findByIdAndUpdate(
                employeeId, 
                { $set: { isActive: false } } // Update object with the correct MongoDB syntax
              );
    
            console.log('Updated Employee Attendance:', updatedEmployeeAttendance);
            return updatedEmployeeAttendance;
        } catch (error) {
            console.error('Error updating attendance:', error);
            throw error;
        }
    }

    async getPreviousMonthAttendance(employeeId: string): Promise<IEmployeeAttendance> {
      
        try {
          const currentDate = new Date();

          const previousMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
      
          const startOfPreviousMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1);
      
          const endOfPreviousMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0);
      
          const attendanceData = await this._employeeAttendanceModel.findOne({
            employeeId: employeeId,
            "attendance.date": {
              $gte: startOfPreviousMonth.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
              $lte: endOfPreviousMonth.toISOString().split('T')[0],   // Convert to YYYY-MM-DD format
            }
          }, {
            attendance: {
              $elemMatch: {
                date: {
                  $gte: startOfPreviousMonth.toISOString().split('T')[0], 
                  $lte: endOfPreviousMonth.toISOString().split('T')[0],
                }
              }
            }
          });
      
          // If no attendance data found, return an empty object of the expected type
          if (!attendanceData) {
           throw new Error(`No attendance records found for employee ID ${employeeId}`);
          }
      
          return attendanceData as IEmployeeAttendance;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
      
      

      async getAttendanceDashboardData(employeeId: string): Promise<any> {
        try {
          const employeeAttendance = await this._employeeAttendanceModel.findOne({ employeeId });
      
          if (!employeeAttendance) {
            throw new Error(`No attendance records found for employee ID ${employeeId}`);
          }
      
          const attendance = employeeAttendance.attendance;
      
          const absentDays = attendance.filter((entry) => entry.status === "Absent").length;
          const presentDays = attendance.filter((entry) => entry.status === "Present").length;
      
          const totalMinutesWorked = attendance.reduce((sum, entry) => sum + (entry.minutes || 0), 0);
          const totalHoursWorked = totalMinutesWorked / 60;
      
          const approvedLeaves = attendance.filter(
            (entry) => entry.status === "Absent" && entry.leaveStatus === "Approved"
          ).length;
      
          const perDayWorkedMinutes = attendance
            .filter((entry) => entry.minutes > 0)
            .map((entry) => ({
              date: entry.date,
              workedMinutes: entry.minutes,
            }));
      
          return {
            absentDays,
            presentDays,
            totalHoursWorked: totalHoursWorked.toFixed(2),
            approvedLeaves,
            perDayWorkedMinutes,
          };
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
      
    
     async fetchApprovedLeaves(employeeId: string): Promise<IEmployeeLeave> {
        try {
          const employeeLeave = await this._employeeLeaveModel.findOne({ employeeId });
      
          if (!employeeLeave) {
            throw new Error(`No leave records found for employee ID ${employeeId}`);
          }
      
          return employeeLeave;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }

}
