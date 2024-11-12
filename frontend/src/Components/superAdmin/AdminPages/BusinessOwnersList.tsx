import React, { useEffect, useState } from "react";
import {
  createColumnHelper,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import Table from "../../global/Table";
import { privateApi } from "../../../services/axiosConfig";

interface Subscription {
  planName: string;
  planType: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationNumber: string;
  subscriptionStatus: string;
  isBlocked: boolean; // Changed to boolean for easier handling
}

const BusinessOwnersList: React.FC = () => {
  const [data, setData] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Define table columns with block/unblock action button
  const columns: ColumnDef<Company>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "registrationNumber", header: "Registration Number" },
    { accessorKey: "subscriptionStatus", header: "Subscription Status" },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <button
          onClick={() => handleActionClick(row.original)}
          className={`flex items-center justify-center gap-2 w-28 h-10 rounded-md text-white font-semibold transition duration-300 shadow-lg ${
            row.original.isBlocked ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          <i
            className={`${
              row.original.isBlocked ? "fi fi-tr-shield-exclamation" : "fi fi-tr-shield-check"
            } text-lg font-bold`}
          ></i>
          <span>{row.original.isBlocked ? "Enable" : "Disable"}</span>
        </button>
      ),
    },
  ];
  
  
  

  // Function to handle block/unblock action
  const handleActionClick = async (company: Company) => {
    try {
      // Toggle isBlocked value
      const newIsBlocked = !company.isBlocked;

      // Send PATCH request to update isBlocked status
      await privateApi.patch(`/businessowner/update-isblocked/${company.id}`, {
        isBlocked: newIsBlocked,
      });

      // Update the local data state to reflect the change
      setData((prevData) =>
        prevData.map((item) =>
          item.id === company.id ? { ...item, isBlocked: newIsBlocked } : item
        )
      );
    } catch (error) {
      console.error("Error updating block status:", error);
      setError("Failed to update block status.");
    }
  };

  // Fetch business owner data from the backend
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await privateApi.get("/businessowner/find-all-companies");

        const businessOwners = response.data.businessOwners.map(
          (businessOwner: any): Company => ({
            id: businessOwner._id,
            name: businessOwner.name,
            email: businessOwner.email,
            phone: businessOwner.phone,
            registrationNumber: businessOwner.registrationNumber,
            subscriptionStatus: businessOwner.subscription?.status || "N/A",
            isBlocked: businessOwner.isBlocked,
          })
        );

        setData(businessOwners);
      } catch (err) {
        console.error("Error fetching business owners:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Business Owners</h1>
      <Table data={data} columns={columns} loading={loading} error={error} />
    </div>
  );
};

export default BusinessOwnersList;
