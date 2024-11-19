import { ColumnDef } from "@tanstack/react-table";

export interface IBusinessOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationNumber: string;
  subscriptionStatus: string;
  isBlocked: boolean;
}

export interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading: boolean;
  error: string | null;
}

export interface LoginFormData{
    email: string;
    password: string;
}

export interface PrivateRouteProps {
  children: React.ReactNode;
}

export interface Employee {
  id: string;      // Unique identifier for the employee
  name: string;    // Employee's name
  position: string; // Job position of the employee
  email: string;   // Employee's email address
  isOnline: boolean; // Employee's online status
}
