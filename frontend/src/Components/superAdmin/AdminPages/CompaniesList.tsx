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
import { saveAs } from "file-saver";
import { FaSearch, FaFileCsv, FaFileExcel, FaFilePdf } from "react-icons/fa";
import DebouncedInput from "../../ui/DebouncedInput";

// Define the Company interface
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
  const [data, setData] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        <button
          onClick={() => handleViewDetails(info.row.original)}
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
        >
          View Details
        </button>
      ),
    }),
  ];

  // Fetch company data from the backend
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:7001/api/super-admin/fetch-companies");
        console.log("Response from backend:", response.data);
        
        // Map response data to match the Company interface
        const companies = response.data.map((company: any) => ({
          id: company._id, // Assuming _id is used for the id
          name: company.name,
          email: company.email,
          phone: company.phone,
          registrationNumber: company.registrationNumber,
          subscription: company.subscription,
        }));

        setData(companies); // Set the mapped companies
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

  const exportToPDF = () => {
    alert("Export to PDF feature coming soon!");
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

        {/* Download buttons */}
        <div className="flex flex-wrap space-x-3 justify-center">
          <CSVLink data={data} filename={"Companies.csv"}>
            <button className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-green-700">
              <FaFileCsv className="mr-2" /> CSV
            </button>
          </CSVLink>
          <button
            onClick={exportToExcel}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-blue-700"
          >
            <FaFileExcel className="mr-2" /> Excel
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-red-700"
          >
            <FaFilePdf className="mr-2" /> PDF
          </button>
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

      {/* Pagination */}
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
