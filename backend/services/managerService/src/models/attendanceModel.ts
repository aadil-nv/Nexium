import mongoose, { Document, Schema } from 'mongoose';
import { IAttendanceEntry,IEmployeeAttendance} from '../entities/attendanceEntities';




// Create the schema for a single day's attendance
const AttendanceEntrySchema: Schema = new Schema({
  date: { type: String },
  status: { type: String, enum: ['Present', 'Leave', 'Absent' ,"marked"] ,default: "Absent"},
  checkInTime: { type: Date ,default: null},
  checkOutTime: { type: Date ,default: null},
  hours: { type: Number ,default: 0},
  leaveType: { type: String, default: null },
  reason: { type: String, default: null },
  leaveStatus: { type: String ,enum:["Pending","Approved","Rejected","null"] ,default: "null"},
  
});

// Create the Employee Attendance schema
const EmployeeAttendanceSchema: Schema = new Schema({
  employeeId: { type: mongoose.Types.ObjectId, ref: 'Employee', required: true }, // Reference to the employee
  attendance: { type: [AttendanceEntrySchema] }, // Array of attendance records
});

// Create the Employee Attendance model
const EmployeeAttendance = mongoose.model<IEmployeeAttendance>('EmployeeAttendance', EmployeeAttendanceSchema);

export default EmployeeAttendance;
