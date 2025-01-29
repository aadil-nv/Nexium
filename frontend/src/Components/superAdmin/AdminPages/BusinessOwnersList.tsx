import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "../../global/Table";
import { Skeleton } from "antd";
import { fetchBusinessOwners, updateBlockStatus } from "../../../api/superAdminApi";
import { IBusinessOwner } from "../../../utils/interfaces";

const BusinessOwnersList: React.FC = () => {
  const [data, setData] = useState<IBusinessOwner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const columns: ColumnDef<IBusinessOwner>[] = [
    { 
      id: 'id',
      accessorFn: (row) => row.id,
      header: "ID" 
    },
    { 
      id: 'name',
      accessorFn: (row) => row.name,
      header: "Name" 
    },
    { 
      id: 'email',
      accessorFn: (row) => row.email,
      header: "Email" 
    },
    { 
      id: 'phone',
      accessorFn: (row) => row.phone,
      header: "Phone" 
    },
    { 
      id: 'subscriptionStatus',
      accessorFn: (row) => row.subscriptionStatus,
      header: "Subscription Status" 
    },
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
      await updateBlockStatus(businessOwner.id, newIsBlocked);
      setData(data.map((item) => (item.id === businessOwner.id ? { ...item, isBlocked: newIsBlocked } : item)));
    } catch (err) {
      console.error("Error updating block status:", err);
      setError("Failed to update block status.");
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchBusinessOwners()
      .then(owners => setData(owners))
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>Business Owners</h1>
      {loading ? (
        <Skeleton active />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <Table<IBusinessOwner> 
          data={data} 
          columns={columns} 
          loading={loading} 
          error={error} 
        />
      )}
    </div>
  );
};

export default BusinessOwnersList;