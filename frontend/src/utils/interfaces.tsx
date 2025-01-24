import { ColumnDef } from "@tanstack/react-table";
import {  AppDispatch } from '../redux/store/store'; // Import your app's dispatch type
import { NavigateFunction } from 'react-router-dom'; // Import the correct type for navigate



export interface IBusinessOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
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


export interface UserStatus { //! Part of navbar Functions do not remove
  isAuthenticated: boolean;
}

export interface NavbarFunctionsProps {
  isBusinessOwner: UserStatus;
  isSuperAdmin: UserStatus;
  isManager: UserStatus;
  isEmployee: UserStatus;
  dispatch: AppDispatch;
  navigate: NavigateFunction;
 
}
