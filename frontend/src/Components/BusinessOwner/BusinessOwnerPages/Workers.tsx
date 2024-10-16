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
import { FaSearch, FaPlus } from "react-icons/fa";
import DebouncedInput from "../../ui/DebouncedInput";
import { useNavigate } from "react-router-dom";

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

const CompaniesList: React.FC = () => {
  const columnHelper = createColumnHelper<Company>();
  const [globalFilter, setGlobalFilter] = useState("");
  const [filterSubscriptionStatus, setFilterSubscriptionStatus] = useState(""); 
  const [data, setData] = useState<Company[]>([]);
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
      cell: (info) => <span>{info.getValue()}</span>,
    }),
  ];

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:7001/api/super-admin/fetch-companies");
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

  // Function to handle adding workers
  const handleAddWorkers = () => {
    navigate("/businessOwner/addworkers");
  };

  return (
    <div className="p-5 max-w-6xl mx-auto bg-white text-gray-800 rounded-lg shadow-lg">
      {/* Filter Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4 space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="w-full lg:w-1/2 flex items-center space-x-2">
          <FaSearch className="text-gray-400" />
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 border-b-2 border-gray-600 focus:border-indigo-500 outline-none bg-gray-100 text-gray-800 w-full transition-all"
            placeholder="Search companies..."
          />
        </div>
        {/* Filter by Subscription Status */}
        <div className="w-full lg:w-1/4">
          <select
            value={filterSubscriptionStatus}
            onChange={(e) => setFilterSubscriptionStatus(e.target.value)}
            className="p-2 border-b-2 border-gray-600 bg-gray-100 text-gray-800 w-full transition-all"
          >
            <option value="">All Subscription Statuses</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Add Worker Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddWorkers}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md transition-transform duration-300 hover:bg-blue-600 hover:scale-105"
        >
          <FaPlus className="mr-2" /> Add Workers
        </button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-indigo-600 text-white">
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
                  <tr
                    key={row.id}
                    className={`bg-gray-${i % 2 === 0 ? "100" : "200"} hover:bg-gray-300 transition-all`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2 text-xs sm:text-sm text-gray-800">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr className="text-center">
                  <td colSpan={columns.length} className="text-black">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-center lg:justify-end mt-4 space-x-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="p-2 bg-gray-800 text-gray-300 rounded-md disabled:opacity-50 text-xs sm:text-sm"
        >
          Previous
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="p-2 bg-gray-800 text-gray-300 rounded-md disabled:opacity-50 text-xs sm:text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CompaniesList;
