import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmployeeState {
  role: string | null;
  isAuthenticated: boolean;
  position: string | null;
  workTime: string | null;
  workTimer: number | null;  // New field to track work timer
}

const initialState: EmployeeState = {
  role: null,
  isAuthenticated: false,
  position: null,  // Default value
  workTime: null,  // Default value
  workTimer: null, // Default value for work timer (in seconds or milliseconds)
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
    },
    updateWorkDetails: (state, action: PayloadAction<{ position: string; workTime: string; workTimer: number }>) => {
      state.position = action.payload.position;
      state.workTime = action.payload.workTime;
      state.workTimer = action.payload.workTimer;  // Update work timer
    },
  },
});

export const { login, logout, updateWorkDetails } = employeeSlice.actions;

export default employeeSlice.reducer;
