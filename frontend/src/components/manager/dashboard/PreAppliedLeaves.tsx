import  { useState, useEffect } from 'react';
import { Table, Tag, Select, Modal, Input, message } from 'antd';
import { managerInstance } from '../../../services/managerInstance';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Option } = Select;

// Define an enum for leave types to provide type safety
enum LeaveType {
  AnnualLeave = 'Annual Leave',
  SickLeave = 'Sick Leave',
  MaternityLeave = 'Maternity Leave',
  PaternityLeave = 'Paternity Leave',
  CompassionateLeave = 'Compassionate Leave',
  UnpaidLeave = 'Unpaid Leave'
}

interface PreAppliedLeave {
  _id: string;
  employeeId: string;
  employeeName?: string;    
  profilePicture?: string;
  leaveType: LeaveType; // Updated to use the enum
  reason: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  rejectionReason?: string;
}

const DEFAULT_PROFILE_IMAGE = "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png";

export default function PreAppliedLeaves() {
  const [leaves, setLeaves] = useState<PreAppliedLeave[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<PreAppliedLeave | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchLeaves = async () => {
    try {
      const { data } = await managerInstance.get('/manager-service/api/leave/pre-applied-leaves');
      setLeaves(data);
    } catch {
      console.log('Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAction = async (action: string, leave: PreAppliedLeave, reason?: string) => {
    try {
      await managerInstance.post(`/manager-service/api/leave/update-pre-applied-leave/${leave.employeeId}`, {
        action,
        rejectionReason: action === 'rejected' ? reason : undefined,
        leaveId: leave._id
      });
      
      // Update the local state to reflect the change
      setLeaves(prevLeaves => 
        prevLeaves.map(l => 
          l._id === leave._id 
            ? { ...l, status: action as PreAppliedLeave['status'] }
            : l
        )
      );
      
      message.success(`Leave ${action}ed successfully`);
    } catch {
      console.log('Failed to update leave');
      
    } finally {
      if (action === 'rejected') {
        setRejectModalVisible(false);
        setSelectedLeave(null);
        setRejectionReason('');
      }
    }
  };

  const columns: ColumnsType<PreAppliedLeave> = [
    {
      title: 'Employee',
      key: 'employee',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <img
            src={record.profilePicture || DEFAULT_PROFILE_IMAGE}
            alt={record.employeeName || 'Employee'}
            className="w-10 h-10 rounded-full object-cover border"
          />
          <span>{record.employeeName || 'Unknown Employee'}</span>
        </div>
      ),
    },
    {
      title: 'Leave Types',
      dataIndex: 'leaveType',
      key: 'leaveTypes',
      width: 200,
      render: (leaveType: LeaveType) => (
        <div className="space-y-1">{leaveType}</div>
      ),
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_, { startDate, endDate, duration }) => (
        <div>
          <div>{`${dayjs(startDate).format('YYYY-MM-DD')} to`}</div>
          <div>{dayjs(endDate).format('YYYY-MM-DD')}</div>
          <div className="text-gray-500">({duration} days)</div>
        </div>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Applied On',
      dataIndex: 'appliedAt',
      key: 'appliedAt',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'approved' ? 'green' : 
          status === 'rejected' ? 'red' : 
          'gold'
        }>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Select
          value={record.status}
          onChange={(value) => {
            if (value === 'rejected') {
              setSelectedLeave(record);
              setRejectModalVisible(true);
            } else {
              handleAction(value, record);
            }
          }}
          style={{ width: 150 }}
        >
          <Option disabled>{record.status}</Option>
          <Option value="approved">Approve</Option>
          <Option value="rejected">Reject</Option>
        </Select>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Pre-Applied Leaves</h1>
      <Table
        columns={columns}
        dataSource={leaves}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="Reject Leave"
        open={rejectModalVisible}
        onOk={() => handleAction('rejected', selectedLeave!, rejectionReason)}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectionReason('');
          setSelectedLeave(null);
        }}
        okText="Reject"
        cancelText="Cancel"
        okButtonProps={{ danger: true, disabled: !rejectionReason.trim() }}
      >
        <Input.TextArea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Provide a reason"
          rows={4}
        />
      </Modal>
    </div>
  );
}