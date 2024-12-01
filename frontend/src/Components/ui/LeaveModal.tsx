import React, { useState } from "react";
import { Modal, Input, Select } from "antd";

type LeaveModalProps = {
  visible: boolean;
  selectedAttendance: { date: string; status: string } | null;
  availableLeaves: { [key: string]: number };
  onCancel: () => void;
  onSubmit: (leaveType: string, reason: string) => void;
};

const LeaveModal: React.FC<LeaveModalProps> = ({
  visible,
  selectedAttendance,
  availableLeaves,
  onCancel,
  onSubmit,
}) => {
  const [leaveType, setLeaveType] = useState<string | null>(null);
  const [reason, setReason] = useState<string>("");

  return (
    <Modal
      title={`Leave for ${selectedAttendance?.date}`}
      visible={visible}
      onCancel={onCancel}
      onOk={() => onSubmit(leaveType!, reason)} // Ensure valid values before submit
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
          <Select.Option value="Sick">
            Sick ({availableLeaves["Sick"] ?? 0} available)
          </Select.Option>
          <Select.Option value="Vacation">
            Vacation ({availableLeaves["Vacation"] ?? 0} available)
          </Select.Option>
          <Select.Option value="Other">
            Other ({availableLeaves["Other"] ?? 0} available)
          </Select.Option>
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
