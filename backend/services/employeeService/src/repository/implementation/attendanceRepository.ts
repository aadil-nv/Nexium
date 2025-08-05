import { IEmployeeAttendance, IAttendanceEntry } from "../../entities/attendanceEntities";
import IAttendanceRepository from "../../repository/interface/IAttendanceRepository";
import mongoose, { Model } from "mongoose";
import { inject, injectable } from "inversify";
import BaseRepository from "./baseRepository";
import IEmployee from "../../entities/employeeEntities";
import { isSunday, format } from 'date-fns';
import { ObjectId } from "mongodb";
import { IEmployeeLeave } from "../../entities/employeeLeaveEntities";
import moment from 'moment'; // Import moment.js for date manipulation.
import connectDB from "../../config/connectDB";




@injectable()
export default class AttendanceRepository extends BaseRepository<IEmployeeAttendance> implements IAttendanceRepository {

  constructor(
    @inject("IEmployeeAttendance") private _employeeAttendanceModel: Model<IEmployeeAttendance>,
    @inject("IEmployee") private _employeeModel: Model<IEmployee>,
    @inject("IEmployeeLeave") private _employeeLeaveModel: Model<IEmployeeLeave>
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

  async updateAttendances(employeeId: string, businessOwnerId: string): Promise<IEmployeeAttendance> {
    try {
      const switchDB = await connectDB(businessOwnerId);
      const EmployeeModel = switchDB.model<IEmployee>('Employee', this._employeeModel.schema);
      const AttendanceModel = switchDB.model<IEmployeeAttendance>('EmployeeAttendance', this._employeeAttendanceModel.schema);

      const employee = await EmployeeModel.findById(employeeId).select('professionalDetails.joiningDate');
      if (!employee) throw new Error("Employee not found");

      const { joiningDate } = employee.professionalDetails;
      const today = new Date();
      if (!joiningDate || joiningDate > today) throw new Error("Invalid joining date");

      const lastDay = new Date(today);
      lastDay.setDate(today.getDate() - 1);

      const allDates = this.generateDatesBetween(joiningDate, lastDay).filter(date => !isSunday(date));

      let attendanceDoc = await AttendanceModel.findOne({ employeeId });

      if (!attendanceDoc) {
        attendanceDoc = new AttendanceModel({ employeeId, attendance: [] });
      }

      const attendanceDates = new Set(attendanceDoc.attendance.map(entry => format(new Date(entry.date), 'yyyy-MM-dd')));
      const missingDates = allDates.filter(date => !attendanceDates.has(format(date, 'yyyy-MM-dd')));

      if (missingDates.length === 0) throw new Error("All attendance data is already available");

      missingDates.forEach(date => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        attendanceDoc.attendance.push({
          date: formattedDate,
          status: formattedDate === format(today, 'yyyy-MM-dd') ? "Present" : "Absent",
          checkInTime: null,
          checkOutTime: null,
          leaveType: null,
          rejectionReason: null,
          reason: null,
          leaveStatus: null,
          minutes: 0,
        });
      });

      return await attendanceDoc.save();
    } catch (error: any) {
      console.error("Error updating attendance:", error);
      throw new Error("Error updating attendance: " + error.message);
    }
  }


  async fetchAttendances(employeeId: string, businessOwnerId: string): Promise<IEmployeeAttendance> {
    try {
      const switchDB = await connectDB(businessOwnerId);
      const attendances = await switchDB.model<IEmployeeAttendance>('EmployeeAttendance', this._employeeAttendanceModel.schema).findOne({ employeeId: new ObjectId(employeeId) })
        .select('attendance employeeId')
        .lean();

      if (!attendances) {
        throw new Error(`No attendance records found for employee ID ${employeeId}`);
      }

      attendances.attendance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      attendances.attendance = attendances.attendance.map(entry => ({
        ...entry,
        status: ["Present", "Absent", "Leave", "Marked", "Halfday"].includes(entry.status) ? entry.status : "Absent"  // Default to "Absent"
      }));

      return attendances as IEmployeeAttendance;  // Cast to the correct type
    } catch (error: any) {
      console.error("Error fetching attendances:", error);
      throw new Error("Error fetching attendances: " + error.message);
    }
  }



  async findAttendanceByEmployeeId(employeeId: string, businessOwnerId: string): Promise<any> {
    try {
      const switchDB = await connectDB(businessOwnerId);
      return await switchDB.model<IEmployeeAttendance>('EmployeeAttendance', this._employeeAttendanceModel.schema).findOne({ employeeId });
    } catch (error) {
      console.error("Error finding attendance by employee ID:", error);
      return { error: "Internal server error" };
    }
  }

  async createAttendanceRecord(employeeId: string, businessOwnerId: string): Promise<IEmployeeAttendance> {
    try {
      const switchDB = await connectDB(businessOwnerId);
      const AttendanceModel = switchDB.model<IEmployeeAttendance>('EmployeeAttendance', this._employeeAttendanceModel.schema);
      const newAttendance = new AttendanceModel({ employeeId, attendance: [] });
      return await newAttendance.save();
    } catch (error: any) {
      console.error("Error creating attendance record:", error);
      throw new Error("Error creating attendance record: " + error.message);
    }
  }



  async markCheckIn(id: string, updateData: any, employeeId: string, businessOwnerId: string): Promise<any> {
    try {

      const newAttendanceEntry = {
        date: updateData.date,
        checkInTime: updateData.checkInTime,
        checkOutTime: updateData.checkOutTime,
        hours: updateData.minutes,
        status: updateData.status,
        leaveStatus: updateData.leaveStatus,
        leaveType: updateData.leaveType,
        reason: updateData.reason,
        rejectionReason: updateData.rejectionReason
      };
      const switchDB = await connectDB(businessOwnerId);
      const updatedEmployeeAttendance = await switchDB.model<IEmployeeAttendance>('EmployeeAttendance', this._employeeAttendanceModel.schema).findByIdAndUpdate(
        { _id: id },
        { $push: { attendance: newAttendanceEntry } },
        { new: true }
      );

      if (!updatedEmployeeAttendance) {
        throw new Error('Employee attendance record not found');
      }
      await switchDB.model<IEmployee>('Employee', this._employeeModel.schema).findByIdAndUpdate(
        employeeId,
        { $set: { isActive: false } }
      );;


      return updatedEmployeeAttendance;
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  }

  async findEmployeeById(employeeId: string, businessOwnerId: string): Promise<IEmployee> {
    try {
      const switchDB = await connectDB(businessOwnerId);
      const employee = await switchDB.model<IEmployee>('Employee', this._employeeModel.schema)
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

  async applyLeave(employeeId: string, leaveData: any, businessOwnerId: string): Promise<any> {
    try {
      const { attendanceId, leaveType, reason, date, duration } = leaveData;
      const switchDB = await connectDB(businessOwnerId);

      const employeeAttendance = await switchDB.model<IEmployeeAttendance>('EmployeeAttendance', this._employeeAttendanceModel.schema).findOne({ employeeId });

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
      dayOfLeave.duration = duration || null;

      await employeeAttendance.save();

      return employeeAttendance;
    } catch (error: any) {
      console.error("Error applying leave:", error);
      throw new Error("Error applying leave: " + error.message);
    }
  }

  async markCheckOut(id: string, updateData: any, employeeId: string, businessOwnerId: string): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ObjectId');
      }
      const switchDB = await connectDB(businessOwnerId);
      const updatedEmployeeAttendance = await switchDB.model<IEmployeeAttendance>('EmployeeAttendance', this._employeeAttendanceModel.schema).findOneAndUpdate(
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
      await switchDB.model<IEmployee>('Employee', this._employeeModel.schema).findByIdAndUpdate(
        employeeId,
        { $set: { isActive: false } }
      );

      return updatedEmployeeAttendance;
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  }

  async getPreviousMonthAttendance(employeeId: string, businessOwnerId: string): Promise<IEmployeeAttendance> {
    try {
      const currentDate = new Date();
      const previousMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
      const startOfPreviousMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1);
      const endOfPreviousMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0);
      const switchDB = await connectDB(businessOwnerId);
      const attendanceData = await switchDB.model<IEmployeeAttendance>('EmployeeAttendance', this._employeeAttendanceModel.schema).findOne({
        employeeId: employeeId,
        "attendance.date": {
          $gte: startOfPreviousMonth.toISOString().split('T')[0],
          $lte: endOfPreviousMonth.toISOString().split('T')[0],
        }
      });

      if (!attendanceData) {
        console.log(`No attendance records found for employee ID ${employeeId}`);
        throw new Error(`No attendance records found for employee ID ${employeeId}`);
      }


      const previousMonthAttendance = attendanceData.attendance.filter((att: any) => {
        const attDate = new Date(att.date);
        return attDate >= startOfPreviousMonth && attDate <= endOfPreviousMonth;
      });

      const result = {
        ...attendanceData.toObject(),
        attendance: previousMonthAttendance,
      };

      return result as IEmployeeAttendance;

    } catch (error) {
      console.error("Error fetching previous month attendance:", error);
      throw error;
    }
  }

  async getAttendanceDashboardData(employeeId: string, businessOwnerId: string): Promise<any> {
    try {
      const switchDB = await connectDB(businessOwnerId);
      const employeeAttendance = await switchDB.model<IEmployeeAttendance>('EmployeeAttendance', this._employeeAttendanceModel.schema).findOne({ employeeId });

      if (!employeeAttendance) {
        return {
          absentDays: 0,
          presentDays: 0,
          totalHoursWorked: "0.00",
          approvedLeaves: 0,
          perDayWorkedMinutes: [],
        };
      }


      const attendance = employeeAttendance.attendance;

      const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
      const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

      const currentMonthAttendance = attendance.filter((entry) =>
        moment(entry.date).isBetween(startOfMonth, endOfMonth, undefined, '[]')
      );

      const absentDays = currentMonthAttendance.filter((entry) => entry.status === 'Absent').length;
      const presentDays = currentMonthAttendance.filter((entry) => entry.status === 'Present').length;

      const totalMinutesWorked = currentMonthAttendance.reduce(
        (sum, entry) => sum + (entry.minutes || 0),
        0
      );
      const totalHoursWorked = totalMinutesWorked / 60;

      const approvedLeaves = currentMonthAttendance.filter(
        (entry) => entry.status === 'Absent' && entry.leaveStatus === 'Approved'
      ).length;

      const perDayWorkedMinutes = currentMonthAttendance
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

  async fetchApprovedLeaves(employeeId: string, businessOwnerId: string): Promise<IEmployeeLeave> {
    try {
      const switchDB = await connectDB(businessOwnerId);
      const employeeLeave = await switchDB.model<IEmployeeLeave>('EmployeeLeave', this._employeeLeaveModel.schema).findOne({ employeeId });

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
