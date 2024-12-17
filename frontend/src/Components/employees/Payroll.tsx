import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { FaFileCsv, FaFileExcel, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Skeleton } from 'antd';
import useTheme from '../../hooks/useTheme';
import { employeeInstance } from '../../services/employeeInstance';

// Define the type for payroll data
interface PayrollData {
  employeeName: string;
  position: string;
  salary: string;
  date: string;
  leaveDays: number;
  workingHours: number;
}

function Payroll() {
  const { themeColor } = useTheme();
  const [payrollData, setPayrollData] = useState<PayrollData[]>([
    // Demo data
    { employeeName: 'John Doe', position: 'Software Engineer', salary: '$5000', date: '2024-11-01', leaveDays: 2, workingHours: 160 },
    { employeeName: 'Jane Smith', position: 'Product Manager', salary: '$6000', date: '2024-11-01', leaveDays: 1, workingHours: 160 },
    { employeeName: 'Alice Johnson', position: 'UI/UX Designer', salary: '$4500', date: '2024-11-01', leaveDays: 0, workingHours: 160 },
  ]);

  const [payrollData2, setPayrollData2] = useState<any>(null);
  const [loading, setLoading] = useState(false); // Set to true while loading data
  const [error, setError] = useState<string | null>(null);
  const [payslipDownloaded, setPayslipDownloaded] = useState(false); // Track if payslip is downloaded


  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        setLoading(true);
        const response = await employeeInstance.get(
          '/employee/api/payroll/get-payroll'
        );
        setPayrollData2(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching department:', error);
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, []);


  console.log("======================================");
  console.log("======================================");
  console.log("======================================");
  console.log("Pay roll daata", payrollData2);
  console.log("======================================");
  console.log("======================================");
  





  // Example function for exporting to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(payrollData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payroll Data');
    XLSX.writeFile(workbook, 'PayrollData.xlsx');
  };

  // Mock function to simulate downloading payslip (for demo purposes)
  const downloadPayslip = (employeeName: string) => {
    console.log(`Downloading payslip for ${employeeName}`);
    
    const payslipContent = `Payslip for ${employeeName}\nDate: 2024-11-01\nSalary: $5000\nLeave Days: 2\nWorking Hours: 160`;
    const blob = new Blob([payslipContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a link to download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = `${employeeName}-Payslip.txt`; // Name the file based on employee
    link.click();
  
    // Clean up the URL object
    URL.revokeObjectURL(url);
  
    setPayslipDownloaded(true); // Set payslipDownloaded to true after download
  };

  return (
    <div className="p-5 max-w-full mx-auto bg-white text-gray-800 rounded-lg shadow-lg">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4 space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex space-x-3">
          {/* Only show CSV and Excel buttons if no payslip has been downloaded */}
          {!payslipDownloaded && (
            <>
              <CSVLink data={payrollData} filename={"PayrollData.csv"}>
                <motion.button
                  className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-green-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaFileCsv className="mr-2" /> CSV
                </motion.button>
              </CSVLink>
              <motion.button
                onClick={exportToExcel}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-blue-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}  
              >
                <FaFileExcel className="mr-2" /> Excel
              </motion.button>
            </>
          )}
        </div>
      </div>

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
                <th className="px-4 py-2 text-xs sm:text-sm text-left">Position</th>
                <th className="px-4 py-2 text-xs sm:text-sm text-left">Salary</th>
                <th className="px-4 py-2 text-xs sm:text-sm text-left">Date</th>
                <th className="px-4 py-2 text-xs sm:text-sm text-left">Leave Days</th>
                <th className="px-4 py-2 text-xs sm:text-sm text-left">Working Hours</th>
                <th className="px-4 py-2 text-xs sm:text-sm text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {payrollData.map((data, i) => (
                <motion.tr
                  key={i}
                  className={`bg-gray-${i % 2 === 0 ? '100' : '200'} hover:bg-gray-300 transition-all`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">{data.employeeName}</td>
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">{data.position}</td>
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">{data.salary}</td>
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">{data.date}</td>
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">{data.leaveDays}</td>
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">{data.workingHours}</td>
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                    <motion.button
                      onClick={() => downloadPayslip(data.employeeName)}
                      className="flex items-center bg-orange-600 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-orange-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaDownload className="mr-2" /> Download Payslip
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
              {!payrollData.length && (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No payroll data available
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

export default Payroll;
