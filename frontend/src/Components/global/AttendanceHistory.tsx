import React, { useState } from "react";
import { motion } from "framer-motion";
import { Empty } from "antd";
import LeaveModal from "../ui/LeaveModal";

type Attendance = {
  date: string;
  status: string;
  checkInTime: string | undefined;
  checkOutTime: string;
  hours: number;
  leaveType?: string | null;
  reason?: string | null;
  leaveStatus?: string;
  _id: string;
};

type AttendanceHistoryProps = { attendanceData: Attendance[]; updateAttendanceData: (updatedData: Attendance[]) => void };

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ attendanceData, updateAttendanceData }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);

  const handleProgressBarWidth = (checkInTime: string | undefined, checkOutTime: string): string => {
    if (!checkInTime) return "0%";
    const checkIn = new Date(`1970-01-01T${checkInTime}:00`);
    const checkOut = new Date(`1970-01-01T${checkOutTime}:00`);
    return `${Math.min(((new Date().getTime() - checkIn.getTime()) / (checkOut.getTime() - checkIn.getTime())) * 100, 100)}%`;
  };

  const handleMakeLeave = (index: number) => {
    setSelectedAttendance(attendanceData[index]);
    setModalVisible(true);
  };

  const handleLeaveSubmit = (leaveType: string, reason: string) => {
    if (selectedAttendance) {
      const updatedData = attendanceData.map(att =>
        att._id === selectedAttendance._id ? { ...att, leaveType, reason, leaveStatus: "Pending" } : att
      );
      // Update attendanceData in parent component
      updateAttendanceData(updatedData);
      setSelectedAttendance(null);
      setModalVisible(false);
    }
  };

  return (
    <div className="mt-4">
      {attendanceData.length === 0 ? (
        <Empty description="No data found" />
      ) : (
        attendanceData.map((attendance, index) => (
          <motion.div key={index} className="mb-3 p-3 bg-gray-100 rounded-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-wrap justify-between mb-1 text-xs">
              <span className="text-gray-800">{attendance.date}</span>
              <span className={`text-xs ${attendance.status === "Present" ? "text-green-500" : attendance.status === "Absent" ? "text-red-500" : "text-yellow-500"}`}>
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
              <span>Check-In: {attendance.checkInTime ?? "N/A"}</span>
              <span>Check-Out: {attendance.checkOutTime}</span>
              <span>Hours: {attendance.hours}</span>
            </div>

            {/* Time Progress Bar */}
            <div className="w-full bg-gray-300 h-2 rounded-full mt-2">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: handleProgressBarWidth(attendance.checkInTime, attendance.checkOutTime) }}></div>
            </div>

            {/* Leave buttons */}
            {attendance.status === "Absent" && attendance.leaveStatus === null && (
              <button onClick={() => handleMakeLeave(index)} className="mt-2 px-4 py-1 bg-yellow-500 text-white text-xs rounded-md hover:bg-yellow-400">
                <i className="fas fa-calendar-day mr-2"></i>Mark as Leave
              </button>
            )}

            {attendance.leaveStatus && (
              <button className={`mt-2 px-4 py-1 text-white text-xs rounded-md ${attendance.leaveStatus === "Pending" ? "bg-blue-500 hover:bg-blue-400" : attendance.leaveStatus === "Approved" ? "bg-green-500 hover:bg-green-400" : "bg-red-500 hover:bg-red-400"}`}>
                <i className={`fas fa-${attendance.leaveStatus === "Approved" ? "check-circle" : attendance.leaveStatus === "Rejected" ? "times-circle" : "clock"} mr-2`}></i>
                {attendance.leaveStatus === "Approved" ? "Leave Approved" : attendance.leaveStatus === "Rejected" ? "Leave Rejected" : "Leave Marked"}
              </button>
            )}
          </motion.div>
        ))
      )}

      {/* Leave Modal */}
      {selectedAttendance && (
        <LeaveModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={handleLeaveSubmit}
          attendanceId={selectedAttendance._id}
          date={selectedAttendance.date}
        />
      )}
    </div>
  );
};

export default AttendanceHistory;
