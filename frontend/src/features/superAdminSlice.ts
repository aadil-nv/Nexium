
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SuperAdminState {
  role: string | null;
  token: string | null;
  isAuthenticated: boolean; 
}

const initialState: SuperAdminState = {
  role: null,
  token: null,
  isAuthenticated: false, 
};

const superAdminSlice = createSlice({
  name: 'super-admin',
  initialState,
  reducers: {
    superadminLogin: (state, action: PayloadAction<{ role: string; token: string; isAuthenticated: boolean }>) => {
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.isAuthenticated = action.payload.isAuthenticated; 
    },
    superadminLogout: (state) => {
      state.role = null;
      state.token = null;
      state.isAuthenticated = false; // Add this line
    },
  },
});

export const { superadminLogin,superadminLogout } = superAdminSlice.actions;

export default superAdminSlice.reducer;
