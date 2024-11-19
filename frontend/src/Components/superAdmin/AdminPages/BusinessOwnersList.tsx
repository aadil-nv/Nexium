import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "../../global/Table";
import { Skeleton } from "antd";
import { superAdminInstance } from "../../../services/superAdminInstance";
import  {IBusinessOwner}  from "../../../utils/interfaces";


const BusinessOwnersList: React.FC = () => {
  const [data, setData] = useState<IBusinessOwner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const columns: ColumnDef<IBusinessOwner>[] = [
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
          onClick={() => toggleBlockStatus(row.original)}
          className={`flex items-center justify-center gap-2 w-28 h-10 rounded-md text-white font-semibold transition ${
            row.original.isBlocked ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          <i className={`${row.original.isBlocked ? "fi fi-tr-shield-exclamation" : "fi fi-tr-shield-check"} text-lg`}></i>
          <span>{row.original.isBlocked ? "Enable" : "Disable"}</span>
        </button>
      ),
    },
  ];

  const toggleBlockStatus = async (businessOwner: IBusinessOwner) => {
    try {
      const newIsBlocked = !businessOwner.isBlocked;
      await superAdminInstance.patch(`/superAdmin/api/businessowner/update-isblocked/${businessOwner.id}`, { isBlocked: newIsBlocked });
      setData(data.map((item) => (item.id === businessOwner.id ? { ...item, isBlocked: newIsBlocked } : item)));
    } catch (err) {
      console.error("Error updating block status:", err);
      setError("Failed to update block status.");
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const { data: responseData } = await superAdminInstance.get("/superAdmin/api/businessowner/find-all-companies");
        setData(
          responseData.businessOwners.map((owner: any) => ({
            id: owner._id,
            name: owner.name,
            email: owner.email,
            phone: owner.phone,
            registrationNumber: owner.registrationNumber,
            subscriptionStatus: owner.subscription?.status || "N/A",
            isBlocked: owner.isBlocked,
          }))
        );
      } catch (err) {
        console.error("Error fetching business owners:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div>
      <h1>Business Owners</h1>
      {loading ? (
        <Skeleton active />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <Table data={data} columns={columns} loading={loading} error={error} />
      )}
    </div>
  );
};

export default BusinessOwnersList;
