import React, { useState } from "react";
import { flexRender, useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { FaSearch, FaFileCsv, FaFileExcel, FaEdit, FaUserLock, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import DebouncedInput from "../../ui/DebouncedInput";
import useTheme from "../../../hooks/useTheme";
import { Skeleton } from "antd";
import { IEmployee } from "../../../interface/managerInterface";
import EditEmployeeModal from "../../ui/EmployeeInfo"

function EmployeesTable({ data, loading, error }: { data: IEmployee[]; loading: boolean; error: string | null }) {
  const { themeColor } = useTheme();
  const [globalFilter, setGlobalFilter] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null);

  console.log("data", data);
  console.log("editted employee id ", editEmployeeId);

  const table = useReactTable({
    data,
    columns: [
       { id: "id", header: "ID", accessorKey: "id" }, 
      { id: "name", header: "Name", accessorKey: "name" },
      { id: "position", header: "Position", accessorKey: "position" },
      { id: "email", header: "Email", accessorKey: "email" },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => (
          <span className={row.getValue("isActive") ? "text-green-500" : "text-red-500"}>
            {row.getValue("isActive") ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex space-x-3 justify-center items-center">
            <motion.button
              onClick={() => handleEditClick(row.getValue("id"))}
              style={{ backgroundColor: themeColor }}
              className="text-white px-4 py-2 rounded-md flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEdit className="text-lg" />
              <span>Edit</span>
            </motion.button>
            {/* Other action buttons */}

            <motion.button
              onClick={() => console.log(`Block ${row.getValue("id")}`)}
              className="text-white bg-yellow-500 px-4 py-2 rounded-md flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUserLock className="text-lg" />
              <span>Block</span>
            </motion.button>
            <motion.button
              onClick={() => console.log(`Delete ${row.getValue("id")}`)}
              className="text-white bg-red-500 px-4 py-2 rounded-md flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSignOutAlt className="text-lg" />
              <span>Delete</span>
            </motion.button>
          </div>
        ),
      },
    ],
    state: { globalFilter },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "Data.xlsx");
  };

  const handleEditClick = (employeeId: string) => {
    setEditEmployeeId(employeeId); // Set the employee ID for editing
    setIsModalVisible(true); // Show the modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal
  };

  return (
    <div className="p-5 max-w-6xl mx-auto bg-white text-gray-800 rounded-lg shadow-lg">
      {/* Filters and Export */}
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
        <div className="flex space-x-3">
          <CSVLink data={data} filename={"Data.csv"}>
            <motion.button className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-green-700">
              <FaFileCsv className="mr-2" /> CSV
            </motion.button>
          </CSVLink>
          <motion.button onClick={exportToExcel} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-blue-700">
            <FaFileExcel className="mr-2" /> Excel
          </motion.button>
        </div>
      </div>

      {/* Table */}
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
                  <td colSpan={6} className="text-center py-4">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-4 py-2 bg-gray-200 text-gray-600 rounded disabled:opacity-50">
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-4 py-2 bg-gray-200 text-gray-600 rounded disabled:opacity-50">
          Next
        </button>
      </div>

      {/* Edit Employee Modal */}
      <EditEmployeeModal
     employeeId={editEmployeeId || ""}  // Default to an empty string if null
    isVisible={isModalVisible}
     onCancel={handleCancel}
     />

    </div>
  );
}

export default EmployeesTable;