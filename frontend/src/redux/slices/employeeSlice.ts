

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmployeeState {
  role: string | null;

  isAuthenticated: boolean; 
}

const initialState: EmployeeState = {
  role: null,
  isAuthenticated: false, 
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ role: string; isAuthenticated: boolean  }>) => {
      state.role = action.payload.role;
      state.isAuthenticated = true; 
    },
    logout: (state) => {
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = employeeSlice.actions;

export default employeeSlice.reducer;
