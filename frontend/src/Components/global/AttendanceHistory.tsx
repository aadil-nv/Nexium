import React, { useState } from "react";
import { motion } from "framer-motion";
import { Empty, Skeleton } from "antd"; // Import Skeleton from Ant Design
import LeaveModal from "../ui/LeaveModal";
import { format } from "date-fns";
import useAuth from "../../hooks/useAuth";
import { getShiftMinutes } from '../../utils/getShiftMinutes'

type Attendance = {
  date: string;
  status: string;
  checkInTime: string | undefined;
  checkOutTime: string;
  minutes: number;
  leaveType?: string | null;
  reason?: string | null;
  leaveStatus?: string;
  _id: string;
  rejectionReason?: string;
};

type AttendanceHistoryProps = { 
  attendanceData: Attendance[]; 
  updateAttendanceData: (updatedData: Attendance[]) => void;
  isLoading: boolean; // Add isLoading to track the loading state
};

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ attendanceData, updateAttendanceData, isLoading }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const { employee } = useAuth()
  const workShift = employee?.workTime;

  const handleProgressBarWidth = (minutes: number): string => {
    const shiftMinutes = getShiftMinutes(workShift || "");
    const progress = (minutes / shiftMinutes) * 100;
    return `${Math.min(progress, 100)}%`;
  };

  const handleMakeLeave = (index: number) => {
    setSelectedAttendance(attendanceData[index]);
    setModalVisible(true);
  };

  const handleLeaveSubmit = (leaveType: string, reason: string, date: string) => {
    if (selectedAttendance) {
      const updatedData = attendanceData.map(att =>
        att._id === selectedAttendance._id 
          ? { ...att, leaveType, reason, leaveStatus: "Pending", date }
          : att
      );
      updateAttendanceData(updatedData);
      setSelectedAttendance(null);
      setModalVisible(false);
    }
  };

  return (
    <div className="mt-4">
      {isLoading ? (
        // Show skeleton loader when data is being fetched
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : attendanceData.length === 0 ? (
        <Empty description="No data found" />
      ) : (
        attendanceData.map((attendance, index) => (
          <motion.div 
            key={index} 
            className="mb-3 p-3 bg-gray-100 rounded-lg" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
          >
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
              <span>
                Check-In: {attendance.checkInTime ? format(new Date(attendance.checkInTime), "yyyy-MM-dd hh:mm:ss a") : "N/A"}
              </span>
              <span>
                Check-Out: {attendance.checkOutTime ? format(new Date(attendance.checkOutTime), "yyyy-MM-dd hh:mm:ss a") : "N/A"}
              </span>
              <span>Minutes: {attendance.minutes}</span>
            </div>

            {/* Time Progress Bar */}
            <div className="w-full bg-gray-300 h-2 rounded-full mt-2">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: handleProgressBarWidth(attendance.minutes) }}></div>
            </div>

            {/* Leave buttons */}
            {attendance.status === "Absent" && attendance.leaveStatus === null && (
              <button 
                onClick={() => handleMakeLeave(index)} 
                className="mt-2 px-4 py-1 bg-yellow-500 text-white text-xs rounded-md hover:bg-yellow-400"
              >
                <i className="fas fa-calendar-day mr-2"></i>Mark as Leave
              </button>
            )}

            {attendance.leaveStatus !== null && (
              <button 
                className={`mt-2 px-4 py-1 text-white text-xs rounded-md ${
                  attendance.leaveStatus === "Pending" ? "bg-blue-500 hover:bg-blue-400" :
                  attendance.leaveStatus === "Approved" ? "bg-green-500 hover:bg-green-400" : "bg-red-500 hover:bg-red-400"
                }`}
              >
                <i className={`fas fa-${attendance.leaveStatus === "Approved" ? "check-circle" : attendance.leaveStatus === "Rejected" ? "times-circle" : "clock"} mr-2`}></i>
                {attendance.leaveStatus === "Approved" ? "Leave Approved" :
                  attendance.leaveStatus === "Rejected" ? "Leave Rejected" : "Pending..."}
              </button>
            )}

            {attendance.leaveStatus === "Rejected" && attendance.rejectionReason && (
              <button className="mt-2 px-4 py-1 text-white text-xs rounded-md bg-red-500 hover:bg-red-400">{`Reason: ${attendance.rejectionReason}`}</button>
            )}
          </motion.div>
        ))
      )}
      
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
