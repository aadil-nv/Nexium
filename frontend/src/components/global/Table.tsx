import { useState } from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  VisibilityState,
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

// Enhanced types for better TypeScript support
interface PaginationState {
  pageSize: number;
  pageIndex: number;
}

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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Enhanced table configuration
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
      columnVisibility,
      pagination,
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Enable advanced filtering
    filterFns: {
      fuzzy: (row, columnId, value) => {
        const rowValue = String(row.getValue(columnId)).toLowerCase();
        return rowValue.includes(String(value).toLowerCase());
      },
    },
  });

  const exportToExcel = (): void => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "Data.xlsx");
  };

  const csvData: CsvDataType<T>[] = data.map(item => {
    return Object.entries(item).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: String(value ?? '')
    }), {} as CsvDataType<T>);
  });

  // Skeleton loader component
  const TableSkeleton = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Skeleton.Input active style={{ width: '30%' }} />
        <div className="flex space-x-2">
          <Skeleton.Button active />
          <Skeleton.Button active />
        </div>
      </div>
      {Array.from({ length: pagination.pageSize }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: columns.length }).map((_, j) => (
            <Skeleton.Input 
              key={j} 
              active 
              style={{ width: `${Math.floor(Math.random() * 40 + 60)}px` }} 
            />
          ))}
        </div>
      ))}
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-gray-400 text-6xl mb-4">📊</div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Data Available</h3>
      <p className="text-gray-400 text-center max-w-md">
        There are no records to display at the moment. Try adjusting your filters or add new data.
      </p>
    </div>
  );

  return (
    <div className="p-2 sm:p-5 max-w-6xl mx-auto bg-white text-gray-800 rounded-lg shadow-lg">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4 space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="w-full lg:w-1/2 flex items-center space-x-2">
          <FaSearch className="text-gray-400 min-w-[1rem]" />
          <DebouncedInput
            value={globalFilter}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 border-b-2 border-gray-600 focus:border-indigo-500 outline-none bg-gray-100 text-gray-800 w-full transition-all"
            placeholder="Search all columns..."
          />
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
          {(businessOwner.isAuthenticated || manager.isAuthenticated) && !superAdmin.isAuthenticated && (
            <motion.button
              onClick={() => setIsModalVisible(true)}
              style={{ backgroundColor: themeColor }}
              className="flex items-center justify-center text-white px-4 py-2 rounded-md transition duration-300 w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus className="mr-2" /> Add Employee
            </motion.button>
          )}

          <div className="flex space-x-2 w-full sm:w-auto">
            <CSVLink
              data={csvData}
              filename={"Data.csv"}
              className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-green-700 w-full sm:w-auto"
            >
              <FaFileCsv className="mr-2" /> CSV
            </CSVLink>
            <motion.button
              onClick={exportToExcel}
              className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-blue-700 w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFileExcel className="mr-2" /> Excel
            </motion.button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div className="text-red-500 p-4 text-center bg-red-50 rounded-lg">
            {error}
          </div>
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead style={{ backgroundColor: themeColor }} className="text-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-2 text-xs sm:text-sm text-left">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanFilter() && (
                        <div className="mt-2">
                          <DebouncedInput
                            value={header.column.getFilterValue() as string}
                            onChange={value => header.column.setFilterValue(value)}
                            placeholder={`Filter ${header.column.id}...`}
                            className="w-full p-1 text-xs bg-white text-gray-800 rounded border border-gray-200"
                          />
                        </div>
                      )}
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
                  transition={{ delay: i * 0.05 }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && data.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <select
              value={pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="p-2 border rounded text-sm"
            >
              {[5, 10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-600">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded disabled:opacity-50 text-sm"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded disabled:opacity-50 text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

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