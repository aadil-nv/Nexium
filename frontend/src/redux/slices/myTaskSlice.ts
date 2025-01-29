import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
  _id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  priority: string;
  dueDate: string;
}

interface TodoState {
  _id: string;
  employeeId: string;
  dueDate: string;
  tasks: Task[];
}

const initialState: TodoState = {
  _id: '',
  employeeId: '',
  dueDate: '',
  tasks: [],
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<TodoState>) {
      state._id = action.payload._id;
      state.employeeId = action.payload.employeeId;
      state.dueDate = action.payload.dueDate;
      state.tasks = action.payload.tasks;
    },
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
    },
    toggleComplete(state, action: PayloadAction<string>) {
      const task = state.tasks.find(t => t._id === action.payload);
      if (task) {
        task.isCompleted = !task.isCompleted;
      }
    },
    updateTask(state, action: PayloadAction<Task>) {
      const index = state.tasks.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
  },
});

export const { setTasks, addTask, toggleComplete, updateTask } = taskSlice.actions;
export default taskSlice.reducer;
