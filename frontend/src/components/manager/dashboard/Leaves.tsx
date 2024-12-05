import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Skeleton, Select, Input } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'; // Import icons
import useTheme from '../../../hooks/useTheme';
import { managerInstance } from '../../../services/managerInstance';

const { Option } = Select;

interface LeaveData {
  employeeName: string;
  leaveType: string;
  leaveDate: string;
  status: string;
  reason: string;
}

function Leaves() {
  const { themeColor } = useTheme();
  const [leaveData, setLeaveData] = useState<LeaveData[]>([]);
  const [filteredData, setFilteredData] = useState<LeaveData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLeaveEmployees = async () => {
      try {
        const { data } = await managerInstance.get('/manager/api/manager/get-leave-employees');
        const fetchedLeaveData = data.map((item: any) => ({
          employeeName: item._id,
          leaveType: item.attendance[0]?.leaveType || 'N/A',
          leaveDate: item.attendance[0]?.date || 'N/A',
          status: item.attendance[0]?.leaveStatus || 'Pending',
          reason: item.attendance[0]?.reason || 'No reason provided',
        }));
        setLeaveData(fetchedLeaveData);
        setFilteredData(fetchedLeaveData);
      } catch (err) {
        setError('Failed to fetch leave data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveEmployees();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredData(leaveData.filter((data) => data.employeeName.toLowerCase().includes(term)));
  };

  const handleActionChange = (value: string, index: number) => {
    const updatedData = [...leaveData];
    updatedData[index].status = value;
    setLeaveData(updatedData);
  };

  return (
   <div>
     <h1 className="text-3xl font-semibold text-gray-800 mb-6 border-l-4 pl-4 border-red-800" style={{ borderColor: themeColor }}>
  Leaves
</h1>
     <div className="p-5 max-w-full mx-auto bg-white text-gray-800 rounded-lg shadow-lg">
      <Input
        placeholder="Search by employee name"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4"
        prefix={<SearchOutlined />} // Search icon
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
                <th className="px-4 py-2 text-xs sm:text-sm text-left">Employee Name</th>
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
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">{data.employeeName}</td>
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">{data.leaveType}</td>
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">{data.leaveDate}</td>
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">{data.status}</td>
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">{data.reason}</td>
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                    <Select
                      defaultValue={data.status}
                      style={{ width: 120 }}
                      onChange={(value) => handleActionChange(value, i)}
                      suffixIcon={<CheckCircleOutlined />} // Approval icon
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
   </div>
  );
}

export default Leaves;
