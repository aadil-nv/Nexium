// src/store/menuSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MenuState {
  activeMenu: boolean;
  themeMode: 'light' | 'dark'; // Add theme mode
  themeColor: string; // Add theme color
}

const initialState: MenuState = {
  activeMenu: true, // Initial state of the active menu
  themeMode: 'light', // Default theme mode
  themeColor: '#3498db', // Default theme color
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
    setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.themeMode = action.payload; // Set theme mode
    },
    setThemeColor: (state, action: PayloadAction<string>) => {
      state.themeColor = action.payload; // Set theme color
    },
  },
});

export const { activeMenu, setActiveMenu, setThemeMode, setThemeColor } = menuSlice.actions;
export default menuSlice.reducer;
