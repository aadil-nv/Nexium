import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
  _id: string;
  taskName: string;
  dueDate: string;
  assignedBy: string;
  status: 'Pending' | 'Completed';
  isApproved: boolean;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
}

const initialState: TaskState = {
  tasks: [], // Initially no tasks
  loading: false,
};

const taskListSlice = createSlice({
  name: 'taskList',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload); // Add the task to the tasks array
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((task) => task._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload; // Update the task at the index
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task._id !== action.payload); // Remove task based on _id
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setTasks, addTask, updateTask, removeTask, setLoading } = taskListSlice.actions;
export default taskListSlice.reducer;
