import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
  _id: string;
  employeeId: string;
  dueDate: Date;
  employeeName: string;
  employeeProfilePicture?: string;
  taskName: string;
  tasks: {
    title: string;
    description?: string;
    isCompleted?: boolean;
    priority?: 'low' | 'medium' | 'high';
  }[];
}

interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [], // Initially no tasks
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((task) => task._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task._id !== action.payload);
    },
    resetTasks: (state) => {
      state.tasks = []; // Clear all tasks
    },
  },
});

export const { setTasks, addTask, updateTask, removeTask, resetTasks } = taskSlice.actions;
export default taskSlice.reducer;
