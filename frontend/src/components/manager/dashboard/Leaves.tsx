import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Skeleton, Select, Input, Modal, message, Empty, Pagination } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import useTheme from '../../../hooks/useTheme';
import { fetchLeaveEmployees, updateLeaveApproval } from '../../../api/managerApi';

const { Option } = Select;

interface LeaveData {
  employeeId: string;
  leaveType: string;
  date: string;
  reason: string;
  leaveStatus: string;
  minutes: number;
  duration: string;
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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of items per page

  useEffect(() => {
    const loadLeaveData = async () => {
      try {
        const fetchedLeaveData = await fetchLeaveEmployees();
        console.log("fetch leave data is ==>", fetchedLeaveData);
        
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
    setCurrentPage(1); // Reset to first page when searching
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
        date: selectedLeave.date,
        leaveType: selectedLeave.leaveType,
        duration: selectedLeave.duration
      });

      if (response.success) {
        leaveData[index].leaveStatus = 'Approved';
        setLeaveData([...leaveData]);
        message.success('Leave approved');
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to approve leave');
    }
  };

  const handleRejectSubmit = async () => {
    if (selectedIndex === null) return;

    const selectedLeave = leaveData[selectedIndex];

    try {
      const response = await updateLeaveApproval(selectedLeave.employeeId, {
        action: 'Rejected',
        reason: rejectionReason,
        date: selectedLeave.date,
        leaveType: selectedLeave.leaveType,
        duration: selectedLeave.duration
      });

      if (response.success) {
        leaveData[selectedIndex].leaveStatus = 'Rejected';
        leaveData[selectedIndex].reason = rejectionReason;
        setLeaveData([...leaveData]);
        message.success('Leave rejected');
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to reject leave');
    } finally {
      setModalVisible(false);
      setRejectionReason('');
    }
  };

  // Calculate pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const total = filteredData.length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-semibold mb-6 border-l-4 pl-4" style={{ borderColor: themeColor }}>
          Leaves
        </h1>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <Input
              placeholder="Search by employee ID"
              value={searchTerm}
              onChange={handleSearch}
              className="mb-6 max-w-md"
              prefix={<SearchOutlined className="text-gray-400" />}
              size="large"
            />
            <div className="overflow-x-auto">
              {loading ? (
                <Skeleton active />
              ) : error ? (
                <Empty description={error} />
              ) : filteredData.length === 0 ? (
                <Empty description="No leave data available" />
              ) : (
                <>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr style={{ backgroundColor: themeColor }}>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white tracking-wider rounded-tl-lg">Employee ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white tracking-wider">Leave Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white tracking-wider">Leave Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white tracking-wider">Duration</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white tracking-wider">Reason</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white tracking-wider rounded-tr-lg">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {paginatedData.map((data, i) => (
                        <motion.tr
                          key={i}
                          className="hover:bg-gray-50 transition-colors duration-200"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.employeeId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{data.leaveType}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {data.date ? new Date(data.date).toDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                              ${data.leaveStatus === 'Approved' ? 'bg-green-100 text-green-800' : 
                                data.leaveStatus === 'Rejected' ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'}`}>
                              {data.leaveStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{data.duration}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{data.reason || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Select
                              defaultValue={data.leaveStatus}
                              style={{ width: 130 }}
                              onChange={(value) => handleActionChange(value, startIndex + i)}
                              className="text-sm"
                            >
                              <Option value="Approved" className="text-green-600 hover:bg-green-50">
                                <div className="flex items-center">
                                  <CheckCircleOutlined className="mr-2" /> Approve
                                </div>
                              </Option>
                              <Option value="Rejected" className="text-red-600 hover:bg-red-50">
                                <div className="flex items-center">
                                  <CloseCircleOutlined className="mr-2" /> Reject
                                </div>
                              </Option>
                            </Select>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-6 flex justify-end">
                    <Pagination
                      current={currentPage}
                      total={total}
                      pageSize={pageSize}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      showTotal={(total) => `Total ${total} items`}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={<div className="text-lg font-semibold">Rejection Reason</div>}
        visible={modalVisible}
        onOk={handleRejectSubmit}
        onCancel={() => setModalVisible(false)}
        okText="Submit"
        cancelText="Cancel"
        okButtonProps={{ 
          style: { backgroundColor: themeColor, borderColor: themeColor }
        }}
      >
        <Input.TextArea
          rows={4}
          placeholder="Please enter the reason for rejection"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          className="mt-2"
        />
      </Modal>
    </div>
  );
}

export default Leaves;