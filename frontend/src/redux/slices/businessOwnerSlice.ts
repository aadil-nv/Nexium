

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BusinessOwnerState {
  role: string | null;
  isAuthenticated: boolean; // Add this line
}

const initialState: BusinessOwnerState = {
  role: null,
  isAuthenticated: false, // Add this line
};

const businessOwnerSlice = createSlice({
  name: 'businessOwner',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ role: string; isAuthenticated: boolean }>) => {
      state.role = action.payload.role;
      state.isAuthenticated = true; // Add this line
    },
    logout: (state) => {
      state.role = null;
   
      state.isAuthenticated = false; // Add this line
    },
  },
});

export const { login, logout } = businessOwnerSlice.actions;

export default businessOwnerSlice.reducer;
