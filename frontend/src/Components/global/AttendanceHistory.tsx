import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaClock, FaCalendarAlt } from "react-icons/fa";
import { Empty, Modal, Input, Select } from "antd"; // Importing Modal, Input, and Select from Ant Design

type Attendance = {
  date: string;
  status: string;
  checkInTime: string | undefined;
  checkOutTime: string;
  hours: number;
  leaveType?: string | null;
  reason?: string | null;
  isCompleted?: boolean;
};

type AttendanceHistoryProps = {
  attendanceData: Attendance[];
};

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ attendanceData }) => {
  const [attendanceStatus, setAttendanceStatus] = useState<string[]>(attendanceData.map((att) => att.status));
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [leaveType, setLeaveType] = useState<string | null>(null);
  const [reason, setReason] = useState<string>("");

  const handleMakeLeave = (index: number) => {
    const updatedStatus = [...attendanceStatus];
    updatedStatus[index] = "Leave"; // Mark as "Leave"
    setAttendanceStatus(updatedStatus);
    setSelectedAttendance(attendanceData[index]);
    setModalVisible(true);
  };

  const handleLeaveSubmit = () => {
    if (selectedAttendance) {
      selectedAttendance.leaveType = leaveType;
      selectedAttendance.reason = reason;
      setModalVisible(false);
      setLeaveType(null);
      setReason("");
    }
  };

  const handleProgressBarWidth = (checkInTime: string | undefined, checkOutTime: string): string => {
    if (!checkInTime) return "0%";
    const checkIn = new Date(`1970-01-01T${checkInTime}:00`);
    const checkOut = new Date(`1970-01-01T${checkOutTime}:00`);
    const totalTime = checkOut.getTime() - checkIn.getTime();
    const currentTime = new Date().getTime() - checkIn.getTime();
    const progress = (currentTime / totalTime) * 100;
    return `${Math.min(progress, 100)}%`;
  };

  return (
    <div className="mt-4">
      {attendanceData.length === 0 ? (
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
              <span>Check-In: {attendance.checkInTime ?? "N/A"}</span>
              <span>Check-Out: {attendance.checkOutTime}</span>
              <span>Hours: {attendance.hours}</span>
            </div>

            {/* Time Progress Bar */}
            <div className="w-full bg-gray-300 h-2 rounded-full mt-2">
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: handleProgressBarWidth(attendance.checkInTime, attendance.checkOutTime) }}
              ></div>
            </div>

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
        ))
      )}

      {/* Modal for Leave Details */}
      <Modal
        title={`Leave for ${selectedAttendance?.date}`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleLeaveSubmit}
      >
        <div className="flex flex-col gap-2">
          <div className="text-sm">Date: {selectedAttendance?.date}</div>
          <div className="text-sm">Attendance Status: {selectedAttendance?.status}</div>
          
          <Select
            value={leaveType}
            onChange={setLeaveType}
            placeholder="Select Leave Type"
            className="mb-2"
          >
            <Select.Option value="Sick">Sick</Select.Option>
            <Select.Option value="Vacation">Vacation</Select.Option>
            <Select.Option value="Other">Other</Select.Option>
          </Select>

          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter Reason"
            className="mb-2"
          />
        </div>
      </Modal>
    </div>
  );
};

export default AttendanceHistory;
