import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from 'antd';
import useTheme from '../../hooks/useTheme';

// Define the type for payroll data (or leave data in this case)
interface LeaveData {
  employeeName: string;
  leaveType: string; // New property for leave type
  leaveDate: string; // New property for leave date
  status: string; // Leave status: e.g. 'Approved', 'Pending'
  reason: string; // Reason for leave
}

function Leaves() {
  const { themeColor } = useTheme();
  const [leaveData, setLeaveData] = useState<LeaveData[]>([
    // Example data with the new leave properties
    { employeeName: 'John Doe', leaveType: 'Sick Leave', leaveDate: '2024-11-01', status: 'Approved', reason: 'Flu' },
    { employeeName: 'Jane Smith', leaveType: 'Vacation', leaveDate: '2024-11-05', status: 'Pending', reason: 'Personal' },
    { employeeName: 'Alice Johnson', leaveType: 'Casual Leave', leaveDate: '2024-11-10', status: 'Approved', reason: 'Family Event' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to show leave status when the button is clicked
  const showLeaveStatus = (status: string) => {
    alert(`Leave Status: ${status}`);
  };

  return (
    <div className="p-5 max-w-full mx-auto bg-white text-gray-800 rounded-lg shadow-lg">
      <div className="overflow-x-auto">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex space-x-4 p-4">
              <Skeleton.Input active style={{ width: 80 }} />
              <Skeleton.Input active style={{ width: 120 }} />
              <Skeleton.Input active style={{ width: 100 }} />
            </div>
          ))
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
              {leaveData.map((data, i) => (
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
                    <motion.button
                      onClick={() => showLeaveStatus(data.status)}
                      className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-blue-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Show Leave Status
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
              {!leaveData.length && (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No leave data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Leaves;
