import React, { useState, useEffect } from "react";
import { Modal, Select, Input } from "antd";
import { employeeInstance } from "../../services/employeeInstance";

type LeaveModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (leaveType: string, reason: string) => void;
  attendanceId: string;
  date: string;
};

const LeaveModal: React.FC<LeaveModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  attendanceId,
  date,
}) => {
  const [leaveType, setLeaveType] = useState<string | null>(null);
  const [reason, setReason] = useState<string>("");
  const [leaveData, setLeaveData] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isVisible) {
      const fetchLeaveData = async () => {
        try {
          const response = await employeeInstance.get(
            "/employee/api/attendance/get-approved-leaves"
          );
          setLeaveData(response.data);
        } catch (error) {
          console.error("Failed to fetch leave data:", error);
        }
      };

      fetchLeaveData();
    }
  }, [isVisible]);

  const handleSubmit = async () => {
    if (leaveType && reason) {
      try {
        // Call the API to apply leave
        const response = await employeeInstance.post(
          "/employee/api/attendance/apply-leave",
          {
            attendanceId,
            leaveType,
            reason,
          }
        );

        if (response.status === 200) {
          console.log("Leave applied successfully:", response.data);
          onSubmit(leaveType, reason);
        } else {
          console.error("Failed to apply leave:", response.data);
        }
      } catch (error) {
        console.error("Error while applying leave:", error);
      }

      setLeaveType(null);
      setReason("");
      onClose();
    }
  };

  return (
    <Modal
      title={`Leave Details for ${date}`}
      visible={isVisible}
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <div className="flex flex-col gap-4">
        <div className="text-sm">Employee ID: {attendanceId}</div>
        <div className="text-sm">Date: {date}</div>

        <Select
          value={leaveType}
          onChange={setLeaveType}
          placeholder="Select Leave Type"
          className="mb-2"
        >
          {Object.entries(leaveData).map(([type, count]) => (
            <Select.Option key={type} value={type}>
              {`${type} (${count} days left)`}
            </Select.Option>
          ))}
        </Select>

        <Input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter Reason"
          className="mb-2"
        />
      </div>
    </Modal>
  );
};

export default LeaveModal;