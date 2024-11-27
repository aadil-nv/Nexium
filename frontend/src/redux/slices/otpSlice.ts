// redux/slices/otpSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OtpState {
  timer: number; // Timer in seconds
}

const initialState: OtpState = {
  timer: 0, // Default to 0
};

const otpSlice = createSlice({
  name: "otp",
  initialState,
  reducers: {
    setTimer: (state, action: PayloadAction<number>) => {
      state.timer = action.payload;
    },
    decrementTimer: (state) => {
      if (state.timer > 0) {
        state.timer -= 1;
      }
    },
  },
});

export const { setTimer, decrementTimer } = otpSlice.actions;
export default otpSlice.reducer;
