import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ManagerData {
  managerName: string;
  department: string;
  email: string;
  phone: string;
  employees: number;
}

interface ManagerState {
  role: string | null;
  isAuthenticated: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  employeeData: any; // Existing field
  managerData: ManagerData[]; // New field
  managerName: string; // Added new field
  managerProfilePicture: string; // Added new field
  companyLogo: string; // Added new field
  managerType: string; // Added new field
  companyName: string; // Added new field
}

const initialState: ManagerState = {
  role: null,
  isAuthenticated: false,
  employeeData: null, // Initialize as null
  managerData: [], // Initialize as empty array
  managerName: "", // Initialize with default value
  managerProfilePicture: "", // Initialize with default value
  companyLogo: "", // Initialize with default value
  managerType: "", // Initialize with default value
  companyName: "", // Initialize with default value
};

const managerSlice = createSlice({
  name: "manager",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ role: string; isAuthenticated: boolean }>
    ) => {
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.role = null;
      state.isAuthenticated = false;
      state.employeeData = null; // Clear employeeData on logout
      state.managerData = []; // Clear managerData on logout
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setEmployeeDatas: (state, action: PayloadAction<{ employeeData: any }>) => {
      state.employeeData = action.payload; // Save employee data
    },
    clearEmployeeData: (state) => {
      console.log("clearEmployeeData");
      state.employeeData = null; // Clear employee data
    },
    fetchManagerDataSuccess: (state, action: PayloadAction<ManagerData[]>) => {
      state.managerData = action.payload;
    },
    setManagerData: (
      state,
      action: PayloadAction<{
        managerName: string;
        managerProfilePicture: string;
        companyLogo: string;
        managerType: string;
        companyName: string;
      }>
    ) => {
      state.managerName = action.payload.managerName;
      state.managerProfilePicture = action.payload.managerProfilePicture;
      state.companyLogo = action.payload.companyLogo;
      state.managerType = action.payload.managerType;
      state.companyName = action.payload.companyName;
    },
  },
});

export const {
  login,
  logout,
  setEmployeeDatas,
  clearEmployeeData,
  fetchManagerDataSuccess,
  setManagerData,
} = managerSlice.actions;

export default managerSlice.reducer;
