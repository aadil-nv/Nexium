import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Skeleton, Select, Input, Modal, Button, message, Empty } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import useTheme from '../../../hooks/useTheme';
import { fetchLeaveEmployees, updateLeaveApproval } from '../../../api/managerApi';

const { Option } = Select;

interface LeaveData {
  employeeId: string;
  leaveType: string;
  leaveDate: Date | null;
  reason: string;
  hours: number;
  leaveStatus: string;
}

function Leaves() {
  const { themeColor } = useTheme();
  const [leaveData, setLeaveData] = useState<LeaveData[]>([]);
  const [filteredData, setFilteredData] = useState<LeaveData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadLeaveData = async () => {
      try {
        const fetchedLeaveData = await fetchLeaveEmployees();
        setLeaveData(fetchedLeaveData);
        setFilteredData(fetchedLeaveData);
      } catch {
        setError('Failed to fetch leave data');
      } finally {
        setLoading(false);
      }
    };
    loadLeaveData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredData(leaveData.filter((data) => data.employeeId.toLowerCase().includes(term)));
  };

  const handleActionChange = async (value: string, index: number) => {
    const selectedLeave = leaveData[index];
    if (value === 'Rejected') {
      setSelectedIndex(index);
      setModalVisible(true);
      return;
    }

    try {
      const response = await updateLeaveApproval(selectedLeave.employeeId, {
        action: 'Approved',
        date: selectedLeave.leaveDate?.toISOString(),
        leaveType: selectedLeave.leaveType,
      });

      if (response.success) {
        leaveData[index].leaveStatus = 'Approved';
        setLeaveData([...leaveData]);
        message.success('Leave approved');
      }
    } catch {
      message.error('Failed to approve leave');
    }
  };

  const handleRejectSubmit = async () => {
    if (selectedIndex === null) return;

    const selectedLeave = leaveData[selectedIndex];

    try {
      const response = await updateLeaveApproval(selectedLeave.employeeId, {
        action: 'Rejected',
        reason: rejectionReason,
        date: selectedLeave.leaveDate?.toISOString(),
        leaveType: selectedLeave.leaveType,
      });

      if (response.success) {
        leaveData[selectedIndex].leaveStatus = 'Rejected';
        leaveData[selectedIndex].reason = rejectionReason;
        setLeaveData([...leaveData]);
        message.success('Leave rejected');
      }
    } catch {
      message.error('Failed to reject leave');
    } finally {
      setModalVisible(false);
      setRejectionReason('');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6 border-l-4 pl-4" style={{ borderColor: themeColor }}>Leaves</h1>
      <div className="p-5 bg-white rounded-lg shadow-lg">
        <Input
          placeholder="Search by employee ID"
          value={searchTerm}
          onChange={handleSearch}
          className="mb-4"
          prefix={<SearchOutlined />}
        />
        <div className="overflow-x-auto">
          {loading ? <Skeleton active /> : error ? <Empty description={error} /> :
            filteredData.length === 0 ? <Empty description="No leave data available" /> :
              <table className="min-w-full border rounded-lg shadow-lg overflow-hidden">
                <thead style={{ backgroundColor: themeColor }} className="text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Employee ID</th>
                    <th className="px-4 py-2 text-left">Leave Type</th>
                    <th className="px-4 py-2 text-left">Leave Date</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Reason</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((data, i) => (
                    <motion.tr
                      key={i}
                      className={`bg-gray-${i % 2 === 0 ? '100' : '200'} hover:bg-gray-300`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-4 py-2 text-black">{data.employeeId}</td>
                      <td className="px-4 py-2 text-black">{data.leaveType}</td>
                      <td className="px-4 py-2 text-black">{data.leaveDate?.toLocaleDateString() || 'N/A'}</td>
                      <td className="px-4 py-2 text-black">{data.leaveStatus}</td>
                      <td className="px-4 py-2 text-black">{data.reason || 'N/A'}</td>
                      <td className="px-4 py-2">
                        <Select
                          defaultValue={data.leaveStatus}
                          style={{ width: 120 }}
                          onChange={(value) => handleActionChange(value, i)}
                          suffixIcon={<CheckCircleOutlined />}
                        >
                          <Option value="Approved" className="text-green-500"><CheckCircleOutlined /> Approve</Option>
                          <Option value="Rejected" className="text-red-500"><CloseCircleOutlined /> Reject</Option>
                        </Select>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>}
        </div>
      </div>

      <Modal
        title="Rejection Reason"
        visible={modalVisible}
        onOk={handleRejectSubmit}
        onCancel={() => setModalVisible(false)}
        okText="Submit"
        cancelText="Cancel"
      >
        <Input.TextArea
          rows={4}
          placeholder="Please enter the reason for rejection"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default Leaves;
