// redux/slices/taskSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
  employeeId: string;
  dueDate: Date;
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
    setTasks: (state, action: PayloadAction<any>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((task) => task.employeeId === action.payload.employeeId);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.employeeId !== action.payload);
    },
  },
});

export const { setTasks, addTask, updateTask, removeTask } = taskSlice.actions;
export default taskSlice.reducer;
