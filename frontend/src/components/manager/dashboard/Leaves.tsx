import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Skeleton, Select, Input, Modal, Button, message } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import useTheme from '../../../hooks/useTheme';
import { fetchLeaveEmployees, updateLeaveApproval } from '../../../api/managerApi'; // Import the API utility

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
      } catch (error) {
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
        const updatedData = [...leaveData];
        updatedData[index].leaveStatus = 'Approved';
        setLeaveData(updatedData);
        message.success('Leave approved successfully!');
      }
    } catch (error) {
      message.error('Failed to approve leave.');
    }
  };

  const handleRejectSubmit = async () => {
    if (selectedIndex === null) return;

    const selectedLeave = leaveData[selectedIndex];

    try {
      const response = await updateLeaveApproval(selectedLeave.employeeId, {
        action: 'Rejected',
        reason: rejectionReason,
        date: new Date().toISOString(),
        leaveType: selectedLeave.leaveType,
      });

      if (response.success) {
        const updatedData = [...leaveData];
        updatedData[selectedIndex].leaveStatus = 'Rejected';
        updatedData[selectedIndex].reason = rejectionReason;
        setLeaveData(updatedData);
        message.success('Leave rejected successfully!');
      }
    } catch (error) {
      message.error('Failed to reject leave.');
    } finally {
      setModalVisible(false);
      setRejectionReason('');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 border-l-4 pl-4 border-red-800" style={{ borderColor: themeColor }}>
        Leaves
      </h1>
      <div className="p-5 max-w-full mx-auto bg-white text-gray-800 rounded-lg shadow-lg">
        <Input
          placeholder="Search by employee ID"
          value={searchTerm}
          onChange={handleSearch}
          className="mb-4"
          prefix={<SearchOutlined />}
        />
        <div className="overflow-x-auto">
          {loading ? (
            <Skeleton active />
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead style={{ backgroundColor: themeColor }} className="text-white">
                <tr>
                  <th className="px-4 py-2 text-xs sm:text-sm text-left">Employee ID</th>
                  <th className="px-4 py-2 text-xs sm:text-sm text-left">Leave Type</th>
                  <th className="px-4 py-2 text-xs sm:text-sm text-left">Leave Date</th>
                  <th className="px-4 py-2 text-xs sm:text-sm text-left">Status</th>
                  <th className="px-4 py-2 text-xs sm:text-sm text-left">Reason</th>
                  <th className="px-4 py-2 text-xs sm:text-sm text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((data, i) => (
                  <motion.tr
                    key={i}
                    className={`bg-gray-${i % 2 === 0 ? '100' : '200'} hover:bg-gray-300 transition-all`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">{data.employeeId}</td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">{data.leaveType}</td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                      {data.leaveDate instanceof Date && !isNaN(data.leaveDate.getTime())
                        ? data.leaveDate.toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">{data.leaveStatus}</td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">{data.reason || 'N/A'}</td>
                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                      <Select
                        defaultValue={data.leaveStatus}
                        style={{ width: 120 }}
                        onChange={(value) => handleActionChange(value, i)}
                        suffixIcon={<CheckCircleOutlined />}
                      >
                        <Option value="Approved">
                          <CheckCircleOutlined /> Approve
                        </Option>
                        <Option value="Rejected">
                          <CloseCircleOutlined /> Reject
                        </Option>
                      </Select>
                    </td>
                  </motion.tr>
                ))}
                {!filteredData.length && (
                  <tr>
                    <td colSpan={6} className="text-center py-4">No leave data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for rejection reason */}
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
