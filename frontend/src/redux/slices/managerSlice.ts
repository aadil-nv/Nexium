import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEmployeeData } from '../../interface/managerInterface';

interface ManagerState {
  role: string | null;
  isAuthenticated: boolean;
  employeeData: any; // Add this field

}

const initialState: ManagerState = {
  role: null,
  isAuthenticated: false,
  employeeData: null, // Initialize as null

};

const managerSlice = createSlice({
  name: 'manager',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ role: string; isAuthenticated: boolean }>) => {
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.role = null;
      state.isAuthenticated = false;
      state.employeeData = null; // Clear employeeData on logout

    },
    setEmployeeDatas: (state, action: PayloadAction<{ employeeData: any}>) => {
      console.log("setEmployeeDatas@@@@@@@@@@@@@")
      state.employeeData = action.payload; // Save employee data

    },
    clearEmployeeData: (state) => {
      console.log("clearEmployeeData")
      state.employeeData = null; // Clear employee data
    },
  },
});

export const { login, logout, setEmployeeDatas, clearEmployeeData } = managerSlice.actions;

export default managerSlice.reducer;
