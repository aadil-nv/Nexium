import mongoose, { Document } from 'mongoose';

interface IAttendance extends Document {
  userId: string;
  date: Date;
  timeIn: Date;
  timeOut: Date;
  hoursWorked: number;
}

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeIn: {
    type: Date,
    required: true,
  },
  timeOut: {
    type: Date,
    required: true,
  },
  hoursWorked: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);