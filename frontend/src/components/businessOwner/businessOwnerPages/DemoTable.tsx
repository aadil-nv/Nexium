import React from "react";
import Table from "../../global/Table";
import { ColumnDef } from "@tanstack/react-table";

interface Person {
  id: number;
  name: string;
  age: number;
  job: string;
  email: string;
  phone: string;
}

export default function DemoTable() {
  const data: Person[] = [
    { id: 1, name: "John Doe", age: 28, job: "Engineer", email: "demo@gmail.com", phone: "1234567890" },
    { id: 2, name: "Jane Smith", age: 32, job: "Designer", email: "demo@gmail.com", phone: "1234567890" },
    { id: 3, name: "Michael Johnson", age: 45, job: "Developer", email: "demo@gmail.com", phone: "1234567890" },
    { id: 4, name: "Emily Davis", age: 27, job: "Manager", email: "demo@gmail.com", phone: "1234567890" },
    { id: 5, name: "David Wilson", age: 40, job: "Architect", email: "demo@gmail.com", phone: "1234567890" },
    { id: 6, name: "Olivia Brown", age: 35, job: "Salesperson", email: "demo@gmail.com", phone: "1234567890" },
    { id: 7, name: "James Taylor", age: 31, job: "Accountant", email: "demo@gmail.com", phone: "1234567890" },
    { id: 8, name: "Sophia Miller", age: 29, job: "HR Manager", email: "demo@gmail.com", phone: "1234567890" },
    { id: 9, name: "Daniel Anderson", age: 37, job: "Project Manager", email: "demo@gmail.com", phone: "1234567890" },
    { id: 10, name: "Emma Wilson", age: 26, job: "Developer", email: "demo@gmail.com", phone: "1234567890" },
    { id: 11, name: "Michael Johnson", age: 45, job: "Designer", email: "demo@gmail.com", phone: "1234567890" },
    { id: 12, name: "Emily Davis", age: 27, job: "Manager", email: "demo@gmail.com", phone: "1234567890" },
    { id: 13, name: "David Wilson", age: 40, job: "Architect", email: "demo@gmail.com", phone: "1234567890" },
    { id: 14, name: "Olivia Brown", age: 35, job: "Salesperson", email: "demo@gmail.com", phone: "1234567890" },
    { id: 15, name: "James Taylor", age: 31, job: "Accountant", email: "demo@gmail.com", phone: "1234567890" },
    { id: 16, name: "Sophia Miller", age: 29, job: "HR Manager", email: "demo@gmail.com", phone: "1234567890" },
    { id: 17, name: "Daniel Anderson", age: 37, job: "Project Manager", email: "demo@gmail.com", phone: "1234567890" },
    { id: 18, name: "Emma Wilson", age: 26, job: "Developer", email: "demo@gmail.com", phone: "1234567890" },
  ];

  const columns: ColumnDef<Person>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "age", header: "Age" },
    { accessorKey: "job", header: "Job Title" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Demo Table</h2>
      {/* <Table data={data} columns={columns} /> */}
    </div>
  );
}
