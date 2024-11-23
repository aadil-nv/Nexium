
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SuperAdminState {
  role: string | null;

  isAuthenticated: boolean; 
}

const initialState: SuperAdminState = {
  role: null,

  isAuthenticated: false, 
};

const superAdminSlice = createSlice({
  name: 'superAdmin',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ role: string; isAuthenticated: boolean}>) => {
      state.role = action.payload.role;

      state.isAuthenticated = true; 
    },
    logout: (state) => {
      state.role = null;
      state.isAuthenticated = false; // Add this line
    },
  },
});

export const {login,logout } = superAdminSlice.actions;

export default superAdminSlice.reducer;
