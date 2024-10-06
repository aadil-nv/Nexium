// src/store/menuSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MenuState {
  activeMenu: boolean;
}

const initialState: MenuState = {
  activeMenu: true, // Initial state of the active menu
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    activeMenu: (state) => {
      state.activeMenu = !state.activeMenu; // Toggle active menu state
    },
    setActiveMenu: (state, action: PayloadAction<boolean>) => {
      state.activeMenu = action.payload; // Set active menu state
    },
  },
});

export const { activeMenu, setActiveMenu } = menuSlice.actions;
export default menuSlice.reducer;
