
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface managerState {
  role: string | null;
  token: string | null;
  isAuthenticated: boolean; 
}

const initialState: managerState = {
  role: null,
  token: null,
  isAuthenticated: false, 
};

const managerSlice = createSlice({
  name: 'manager',
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

export const {login,logout } = managerSlice.actions;

export default managerSlice.reducer;
