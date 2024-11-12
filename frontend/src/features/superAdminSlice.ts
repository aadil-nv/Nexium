
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
  name: 'superAdmin',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ role: string; token: string;}>) => {
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.isAuthenticated = true; 
    },
    logout: (state) => {
      state.role = null;
      state.token = null;
      state.isAuthenticated = false; // Add this line
    },
  },
});

export const {login,logout } = superAdminSlice.actions;

export default superAdminSlice.reducer;
