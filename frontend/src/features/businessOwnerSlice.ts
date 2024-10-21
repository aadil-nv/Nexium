// features/businessOwnerSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BusinessOwnerState {
  role: string | null;
  token: string | null;
  isAuthenticated: boolean; // Add this line
}

const initialState: BusinessOwnerState = {
  role: null,
  token: null,
  isAuthenticated: false, // Add this line
};

const businessOwnerSlice = createSlice({
  name: 'businessOwner',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ role: string; token: string; isAuthenticated: boolean }>) => {
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.isAuthenticated = action.payload.isAuthenticated; // Add this line
    },
    logout: (state) => {
      state.role = null;
      state.token = null;
      state.isAuthenticated = false; // Add this line
    },
  },
});

export const { login, logout } = businessOwnerSlice.actions;

export default businessOwnerSlice.reducer;
