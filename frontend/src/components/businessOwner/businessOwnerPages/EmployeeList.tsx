import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "../../global/Table";
import { ColumnDef } from "@tanstack/react-table";

const EmployeesLists: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessOwners = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:7002/api/businessowner/fetch-all-businessowners");
        const businessOwners = response.data.businessOwners.map((owner: any) => ({
          id: owner._id,
          name: owner.name,
          email: owner.email,
          phone: owner.phone,
          registrationNumber: owner.registrationNumber,
          subscriptionStatus: owner.subscription?.status ?? "N/A",
        }));
        setData(businessOwners);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessOwners();
  }, []);

  // Define columns for the table
  const columns: ColumnDef<any>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "registrationNumber", header: "Registration Number" },
    { accessorKey: "subscriptionStatus", header: "Subscription Status" },
  ];

  return (
    <div>
      <h1 className="text-2xl">Employees</h1>
      <Table data={data} columns={columns} loading={loading} error={error} />
    </div>
  );
};

export default EmployeesLists;
