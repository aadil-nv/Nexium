import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LeaveData {
  employeeName: string;
  leaveType: string;
  leaveDate: string;
  status: string;
  reason: string;
}

interface LeaveState {
  leaveData: LeaveData[];
  loading: boolean;
  error: string | null;
}

const initialState: LeaveState = {
  leaveData: [],
  loading: false,
  error: null,
};

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    fetchLeaveEmployeesRequest(state) {
      state.loading = true;
    },
    fetchLeaveEmployeesSuccess(state, action: PayloadAction<LeaveData[]>) {
      state.leaveData = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchLeaveEmployeesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchLeaveEmployeesRequest,
  fetchLeaveEmployeesSuccess,
  fetchLeaveEmployeesFailure,
} = leaveSlice.actions;

export default leaveSlice.reducer;
