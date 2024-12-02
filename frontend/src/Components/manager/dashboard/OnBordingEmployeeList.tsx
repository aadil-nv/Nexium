import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from 'antd';
import useTheme from '../../../hooks/useTheme';

interface OnboardingEmployeeData {
  name: string;
  email: string;
  phone: string;
  status: string;
}

const OnboardingEmployeeList = () => {
  const { themeColor } = useTheme();
  const [employeeData] = useState<OnboardingEmployeeData[]>([
    { name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', status: 'Pending' },
    { name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321', status: 'Active' },
    { name: 'Alice Johnson', email: 'alice.johnson@example.com', phone: '555-555-5555', status: 'Inactive' },
  ]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const headings = ['Name', 'Email', 'Phone', 'Status', 'Action'];

  return (
    <div className="p-5 max-w-full mx-auto bg-white text-gray-800 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Onboarding Employee List</h2>
      <div className="overflow-x-auto">
        {loading ? (
          Array(3).fill(null).map((_, i) => (
            <Skeleton.Input key={i} active style={{ width: 120 }} />
          ))
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead style={{ backgroundColor: themeColor }} className="text-white">
              <tr>
                {headings.map((heading, i) => (
                  <th key={i} className="px-4 py-2 text-xs sm:text-sm text-left">
                    <button className="text-white underline hover:text-blue-200">{heading}</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employeeData.map((data, i) => (
                <motion.tr
                  key={i}
                  className={`bg-gray-${i % 2 === 0 ? '100' : '200'} hover:bg-gray-300 transition-all`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {Object.values(data).map((val, j) => (
                    <td key={j} className="px-4 py-2 text-xs sm:text-sm">{val}</td>
                  ))}
                  <td className="px-4 py-2 text-xs sm:text-sm">
                    <motion.button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Update
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
              {!employeeData.length && (
                <tr>
                  <td colSpan={headings.length} className="text-center py-4">
                    No employee data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OnboardingEmployeeList;
