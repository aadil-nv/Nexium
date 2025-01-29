import { useState } from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { FaSearch, FaFileCsv, FaFileExcel, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import DebouncedInput from "../ui/DebouncedInput";
import AddManagerModal from "../ui/AddManagerModal";
import useTheme from "../../hooks/useTheme";
import { Skeleton } from "antd";
import useAuth from "../../hooks/useAuth";
import { TableProps } from '../../utils/interfaces';
import AddEmployeeModal from "./AddEmployeeModal";

// Type for CSV data
type CsvDataType<T extends object> = {
  [K in keyof T]: string;
};

function Table<T extends object>({ 
  data, 
  columns, 
  loading, 
  error 
}: TableProps<T>) {
  const { themeColor } = useTheme();
  const { superAdmin, businessOwner, manager } = useAuth();
  const [globalFilter, setGlobalFilter] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const exportToExcel = (): void => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "Data.xlsx");
  };

  // Convert data to CSV format with proper typing
  const csvData: CsvDataType<T>[] = data.map(item => {
    return Object.entries(item).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: String(value ?? '')
    }), {} as CsvDataType<T>);
  });

  return (
    <div className="p-5 max-w-6xl mx-auto bg-white text-gray-800 rounded-lg shadow-lg">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4 space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="w-full lg:w-1/2 flex items-center space-x-2">
          <FaSearch className="text-gray-400" />
          <DebouncedInput
            value={globalFilter}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 border-b-2 border-gray-600 focus:border-indigo-500 outline-none bg-gray-100 text-gray-800 w-full transition-all"
            placeholder="Search..."
          />
        </div>

        {(businessOwner.isAuthenticated || manager.isAuthenticated) && !superAdmin.isAuthenticated && (
          <motion.button
            onClick={() => setIsModalVisible(true)}
            style={{ backgroundColor: themeColor }}
            className="flex items-center text-white px-4 py-2 rounded-md transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus className="mr-2" /> Add Employee
          </motion.button>
        )}

        <div className="flex space-x-3">
          <CSVLink
            data={csvData}
            filename={"Data.csv"}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-green-700"
          >
            <FaFileCsv className="mr-2" /> CSV
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
              {table.getRowModel().rows.map((row, i) => (
                <motion.tr
                  key={row.id}
                  className={`bg-gray-${i % 2 === 0 ? "100" : "200"} hover:bg-gray-300 transition-all`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))}
              {!table.getRowModel().rows.length && (
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

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-200 text-gray-600 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-gray-200 text-gray-600 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {businessOwner.isAuthenticated ? (
        <AddManagerModal 
          isVisible={isModalVisible} 
          onClose={() => setIsModalVisible(false)} 
          onManagerAdded={() => {}} 
        />
      ) : manager.isAuthenticated ? (
        <AddEmployeeModal 
          isVisible={isModalVisible} 
          onClose={() => setIsModalVisible(false)} 
          onManagerAdded={() => {}} 
        />
      ) : null}
    </div>
  );
}

export default Table;