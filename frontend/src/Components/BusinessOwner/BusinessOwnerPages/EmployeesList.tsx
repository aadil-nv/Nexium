import React, { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FaSearch, FaPlus } from "react-icons/fa";
import DebouncedInput from "../../ui/DebouncedInput";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";

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

const EmployeesList = () => {
  const currentColor = useSelector((state: RootState) => state.menu.themeColor);
  const columnHelper = createColumnHelper<Company>();
  const [globalFilter, setGlobalFilter] = useState("");
  const [filterSubscriptionStatus, setFilterSubscriptionStatus] = useState(""); 
  const [data, setData] = useState<Company[]>([/* Initial data here */]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      cell: (info) => {
        const status = info.getValue();
        const statusColor = status === "Active" ? "text-green-500" : "text-red-500"; // Example color logic
        return <span className={statusColor}>{status}</span>;
      },
    }),
  ];

  const table = useReactTable({
    data: data.filter((company) =>
      filterSubscriptionStatus ? company.subscription.status === filterSubscriptionStatus : true
    ),
    columns,
    state: {
      globalFilter,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleAddWorkers = () => {
    navigate("/business-owner/addworkers");
  };

  return (
    <div className="p-5 max-w-6xl mx-auto bg-white text-gray-800 rounded-lg shadow-lg">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Filter Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4 space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="w-full lg:w-1/2 flex items-center space-x-2">
          <FaSearch className="text-gray-400" />
          <DebouncedInput
            value={globalFilter}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Search Companies..."
            className="border rounded p-2 w-full"
          />
        </div>
        <button
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={handleAddWorkers}
        >
          <FaPlus className="mr-2" />
          Add Workers
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="border-b border-gray-300 bg-gray-200 p-2">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b border-gray-300">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeesList;
