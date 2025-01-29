import { useEffect, useState } from 'react';
import { FaFilePdf, FaSearch, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Skeleton, Empty } from 'antd';
import useTheme from '../../hooks/useTheme';
import { employeeInstance } from '../../services/employeeInstance';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { generatePayslip } from '../../utils/generatePayslip';

// Define the types for the payroll response
interface Payroll {
  payDate: string;
  month: string;
  year: string;
  totalWorkedMinutes: number;
  totalPresentDays: number;
  totalAbsentDays: number;
  netSalary: number;
  paymentStatus: string;
  paymentMethod: string;
  employeeName: string;
  _id: string;
}

interface PayrollResponse {
  employeeId: string;
  payroll: Payroll[];
}

const Payroll = () => {
  const { themeColor } = useTheme();
  const [payrollData, setPayrollData] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<Payroll[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tableFields = [
    { header: 'Month', field: 'month' },
    { header: 'Year', field: 'year' },
    { header: 'Working Minutes', field: 'totalWorkedMinutes' },
    { header: 'Present Days', field: 'totalPresentDays' },
    { header: 'Leave Days', field: 'totalAbsentDays' },
    { header: 'Net Salary', field: 'netSalary' },
    { header: 'Pay Date', field: 'payDate' },
    { header: 'Action', field: 'action' },
  ];

  const getMonthName = (monthNumber: string) => [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
  ][parseInt(monthNumber) - 1];

  useEffect(() => {
    setLoading(true);
    employeeInstance
      .get<PayrollResponse>('/employee-service/api/payroll/get-payroll')
      .then((response) => {
        setPayrollData(response.data.payroll);
        setFilteredData(response.data.payroll); // Initialize filtered data
        setLoading(false);
      })
      .catch((err) => {
        setError(`Failed to load payroll data: ${err.message || 'Unknown error'}`);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredData(payrollData);
    } else {
      const filtered = payrollData.filter((item) =>
        item.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, payrollData]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumns = tableFields.map((field) => field.header);
    const tableRows = filteredData.map((data) =>
      tableFields.map(({ field }) => {
        if (field === 'month') return getMonthName(data.month);
        if (field === 'netSalary') return data.netSalary.toFixed(2);
        if (field === 'payDate') return new Date(data.payDate).toISOString().split('T')[0];
        return data[field as keyof Payroll] || '';
      })
    );

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
    });

    doc.save('payroll.pdf');
  };

  const downloadPayslip = (payrollId: string) => {
    
    employeeInstance
      .get(`/employee-service/api/payroll/download-parollMonthly/${payrollId}`)
      .then((response) => {
        if (response.data) {
          generatePayslip(response.data); // Generate and download payslip as PDF
        } else {
          console.error('No data received in the response');
        }
      })
      .catch((err) => {
        console.error('Error downloading payslip:', err);
      });
  };

  const handlePagination = (direction: string) => {
    if (direction === 'next') {
      setCurrentPage((prevPage) => prevPage + 1);
    } else {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const paginateData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  return (
    <div>
      <div>
        <h1>Payroll</h1>
      </div>
      <div className="p-5 max-w-full mx-auto bg-white text-gray-800 rounded-lg shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-4 space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex space-x-3">
            <motion.button onClick={exportToPDF} className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
              <FaFilePdf className="mr-2" /> Download PDF
            </motion.button>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border rounded-md"
              placeholder="Search by employee name"
            />
            <motion.button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              <FaSearch />
            </motion.button>
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
            <Empty description="Failed to load payroll data" />
          ) : filteredData.length === 0 && !loading && !error ? (
            <Empty description="No payroll data available" />
          ) : (
            <table id="payroll-table" className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead style={{ backgroundColor: themeColor }} className="text-white">
                <tr>
                  {tableFields.map(({ header }, index) => (
                    <th key={index} className="px-4 py-2 text-xs sm:text-sm text-left">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginateData().map((data, i) => (
                  <motion.tr key={i} className={`bg-gray-${i % 2 === 0 ? '100' : '200'} hover:bg-gray-300`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    {tableFields.map(({ field }, index) => (
                      <td key={index} className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                        {field === 'month' ? data.month :
                          field === 'netSalary' ? data.netSalary.toFixed(2) :
                          field === 'payDate' ? new Date(data.payDate).toISOString().split('T')[0] :
                          field === 'action' ? (
                            <motion.button onClick={() => downloadPayslip(data._id)} className="flex items-center bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700">
                              <FaDownload className="mr-2" /> Download Payslip
                            </motion.button>
                          ) : data[field as keyof Payroll]}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <button onClick={() => handlePagination('prev')} disabled={currentPage === 1} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
            Previous
          </button>
          <button onClick={() => handlePagination('next')} disabled={filteredData.length <= currentPage * itemsPerPage} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
