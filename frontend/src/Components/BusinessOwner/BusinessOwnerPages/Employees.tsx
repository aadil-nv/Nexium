import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { FaSearch, FaFileCsv, FaFileExcel, FaPlus } from "react-icons/fa";
import DebouncedInput from "../../ui/DebouncedInput";
import { motion } from "framer-motion"; 
import AddEmployeeModal from "../../ui/AddEmployeeModal";
import  useTheme  from "../../../hooks/useTheme"

interface Subscription {
  planName: string;
  planType: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  registrationNumber: string;
  subscription: Subscription;
}

const Employees: React.FC = () => {
  const {themeColor} = useTheme()
  const columnHelper = createColumnHelper<Company>();
  const [globalFilter, setGlobalFilter] = useState("");
  const [data, setData] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Define table columns
  const columns = [
    columnHelper.accessor((row, index) => index + 1, {
      header: "No",
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor("name", {
      header: "Company Name",
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor("phone", {
      header: "Contact",
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor("registrationNumber", {
      header: "Registration Number",
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor("subscription.status", {
      header: "Subscription Status",
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: "details",
      header: "Actions",
      cell: (info) => (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleViewDetails(info.row.original)}
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
        >
          View Details
        </motion.button>
      ),
    }),
  ];

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:7001/api/business-owner/find-all-managers");
        console.log("Response from backend:", response.data);
        
        const companies = response.data.map((company: any) => ({
          id: company._id,
          name: company.name,
          email: company.email,
          phone: company.phone,
          registrationNumber: company.registrationNumber,
          subscription: company.subscription,
        }));
        setData(companies);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
    
  }, []);

  
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleViewDetails = (company: Company) => {
    alert(`Details of ${company.name}: \nEmail: ${company.email} \nPhone: ${company.phone} \nRegistration Number: ${company.registrationNumber}`);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");
    XLSX.writeFile(workbook, "Companies.xlsx");
  };

  return (
    <div className="p-5 max-w-6xl mx-auto bg-white text-gray-800 rounded-lg shadow-lg">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4 space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search bar */}
        <div className="w-full lg:w-1/2 flex items-center space-x-2">
          <FaSearch className="text-gray-400" />
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 border-b-2 border-gray-600 focus:border-indigo-500 outline-none bg-gray-100 text-gray-800 w-full transition-all"
            placeholder="Search companies..."
          />
        </div>

        {/* Add Employee Button */}
        <motion.button
          onClick={handleOpenModal}
          style={{ backgroundColor: themeColor }}
          className="flex items-center text-white px-4 py-2 rounded-md transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus className="mr-2" /> Add Employee
        </motion.button>

        {/* Download buttons */}
        <div className="flex flex-wrap space-x-3 justify-center">
          <CSVLink data={data} filename={"Companies.csv"}>
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
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-indigo-600 text-white" style={{ backgroundColor: themeColor }}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-2 text-xs sm:text-sm text-left">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    className={`bg-gray-${i % 2 === 0 ? "100" : "200"} hover:bg-gray-300 transition-all`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          <span className="text-sm">
            {table.getPageCount()} Pages | Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
        </div>
        <div>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-1 mx-1 text-sm bg-indigo-500 text-white rounded-md"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-1 mx-1 text-sm bg-indigo-500 text-white rounded-md"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Employee Modal */}
      {isModalVisible && <AddEmployeeModal isVisible={isModalVisible} onClose={handleCloseModal}/>}
    </div>
  );
};

export default Employees;
