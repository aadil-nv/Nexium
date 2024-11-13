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
