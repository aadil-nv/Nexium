import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaClock, FaCalendarAlt } from "react-icons/fa";

type Attendance = {
  date: string;
  status: string;
  checkInTime: string | undefined; // Allow undefined for checkInTime
  checkOutTime: string;
  hours: number;
  leaveType?: string | null;  // Optional property
  reason?: string | null;     // Optional property
  fullDay: boolean;
};

type AttendanceHistoryProps = {
  attendanceData: Attendance[];
};

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ attendanceData }) => {
  // State to track and update the attendance status
  const [attendanceStatus, setAttendanceStatus] = useState<string[]>(attendanceData.map(att => att.status));

  const handleMakeLeave = (index: number) => {
    const updatedStatus = [...attendanceStatus];
    updatedStatus[index] = "Leave"; // Mark as "Leave"
    setAttendanceStatus(updatedStatus);
  };

  // Function to calculate time progress bar width
  const calculateProgressBarWidth = (checkInTime: string | undefined, checkOutTime: string): string => {
    if (!checkInTime) return "0%"; // If checkInTime is undefined, return 0% as the progress

    const checkIn = new Date(`1970-01-01T${checkInTime}:00`);
    const checkOut = new Date(`1970-01-01T${checkOutTime}:00`);
    const totalTime = checkOut.getTime() - checkIn.getTime(); // Time difference in milliseconds
    const currentTime = new Date().getTime() - checkIn.getTime(); // Current time passed since check-in
    const progress = (currentTime / totalTime) * 100; // Calculate progress percentage
    return `${Math.min(progress, 100)}%`; // Ensure the progress is capped at 100%
  };

  return (
    <div className="mt-4">
      {attendanceData.map((attendance, index) => (
        <motion.div
          key={index}
          className="mb-3 p-3 bg-gray-100 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap justify-between mb-1 text-xs">
            <span className="text-gray-800">{attendance.date}</span>
            <span
              className={`text-xs ${
                attendance.status === "Present"
                  ? "text-green-500"
                  : attendance.status === "Absent"
                  ? "text-red-500"
                  : "text-yellow-500"
              }`}
            >
              {attendance.status}
            </span>
          </div>

          {attendance.status === "Leave" && (
            <div className="text-xs text-gray-800">
              <span>Leave Type: {attendance.leaveType} </span>
              <span>Reason: {attendance.reason}</span>
            </div>
          )}

          <div className="flex flex-wrap justify-between text-xs text-gray-800 mt-1">
            <span>Check-In: {attendance.checkInTime ?? "N/A"}</span> {/* Show N/A if checkInTime is undefined */}
            <span>Check-Out: {attendance.checkOutTime}</span>
            <span>Hours: {attendance.hours}</span>
          </div>

          {/* Time Progression Bar */}
          <div className="w-full bg-gray-300 h-2 rounded-full mt-2">
            <div
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: calculateProgressBarWidth(attendance.checkInTime, attendance.checkOutTime) }}
            ></div>
          </div>

          <span
            className={`text-xs ${attendance.fullDay ? "text-green-500" : "text-orange-500"}`}
          >
            {attendance.fullDay ? "Full Day" : "Half Day"}
          </span>

          {/* Button to mark as Leave if status is Absent */}
          {attendance.status === "Absent" && (
            <button
              onClick={() => handleMakeLeave(index)}
              className="mt-2 px-4 py-1 bg-yellow-500 text-white text-xs rounded-md hover:bg-yellow-400"
            >
              Mark as Leave
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default AttendanceHistory;
