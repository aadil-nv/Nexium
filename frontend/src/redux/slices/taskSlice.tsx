import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SubTask {
  title: string;
  priority: string;
  description: string;
  isCompleted: boolean;
  _id?: string;
  taskStatus?: string;
  response?: string;
}

interface Task {
  _id?: string;
  employeeProfilePicture: string;
  employeeName: string;
  dueDate: string;
  assignedBy: string;
  assigenedDate: string;
  taskName: string;
  isApproved?: boolean;
  tasks: SubTask[];
  employeeId?: string;
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
