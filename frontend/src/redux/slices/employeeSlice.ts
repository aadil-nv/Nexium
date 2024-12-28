import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmployeeState {
  role: string | null;
  isAuthenticated: boolean;
  position: string | null;
  workTime: string | null;
  workTimer: number | null; 
  employeeName: string; // New field for employee name
  employeeProfilePicture: string; 
  companyLogo: string; // New field for company logo
  employeeType: string; // New field for employee type
  companyName: string; // New field for company name
}

const initialState: EmployeeState = {
  role: null,
  isAuthenticated: false,
  position: null,  // Default value
  workTime: null,  // Default value
  workTimer: null, // Default value for work timer (in seconds or milliseconds)
  employeeName: "", // Initialize with default value
  employeeProfilePicture: "", // Initialize with default value
  companyLogo: "", // Initialize with default value
  employeeType: "", // Initialize with default value
  companyName: "", // Initialize with default value
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ role: string; isAuthenticated: boolean; position: string; workTime: string; workTimer: number }>) => {
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.position = action.payload.position;
      state.workTime = action.payload.workTime;
      state.workTimer = action.payload.workTimer;  // Set work timer
    },
    logout: (state) => {
      state.role = null;
      state.isAuthenticated = false;
      state.position = null;
      state.workTime = null;
      state.workTimer = null;  // Reset work timer
      state.employeeName = ""; // Reset employee name
      state.employeeProfilePicture = ""; // Reset employee profile picture
      state.companyLogo = ""; // Reset company logo
      state.employeeType = ""; // Reset employee type
      state.companyName = ""; // Reset company name
      

    },
    updateWorkDetails: (state, action: PayloadAction<{ position: string; workTime: string; workTimer: number }>) => {
      state.position = action.payload.position;
      state.workTime = action.payload.workTime;
      state.workTimer = action.payload.workTimer;  // Update work timer
    },
    setEmployeeData: (
      state,
      action: PayloadAction<{
        employeeName: string;
        employeeProfilePicture: string;
        companyLogo: string;
        employeeType: string;
        companyName: string;
      }>
    ) => {
      state.employeeName = action.payload.employeeName;
      state.employeeProfilePicture = action.payload.employeeProfilePicture;
      state.companyLogo = action.payload.companyLogo;
      state.employeeType = action.payload.employeeType;
      state.companyName = action.payload.companyName;
    },
  },
});

export const { login, logout, updateWorkDetails, setEmployeeData } = employeeSlice.actions;

export default employeeSlice.reducer;
