import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BusinessOwnerState {
  role: string | null;
  isAuthenticated: boolean;
  companyName: string;
  businessOwnerProfilePicture: string;
  companyLogo: string;
}

const initialState: BusinessOwnerState = {
  role: null,
  isAuthenticated: false,
  companyName: "",
  businessOwnerProfilePicture: "",
  companyLogo: "",
};

const businessOwnerSlice = createSlice({
  name: 'businessOwner',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ role: string; isAuthenticated: boolean }>) => {
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.role = null;
      state.isAuthenticated = false;
      state.companyName = "";
      state.businessOwnerProfilePicture = "";
      state.companyLogo = "";
    },
    setBusinessOwnerData: (
      state,
      action: PayloadAction<{
        companyName: string;
        businessOwnerProfilePicture: string;
        companyLogo: string;
      }>
    ) => {
      state.companyName = action.payload.companyName;
      state.businessOwnerProfilePicture = action.payload.businessOwnerProfilePicture;
      state.companyLogo = action.payload.companyLogo;
    },
  },
});

export const { login, logout, setBusinessOwnerData } = businessOwnerSlice.actions;

export default businessOwnerSlice.reducer;
