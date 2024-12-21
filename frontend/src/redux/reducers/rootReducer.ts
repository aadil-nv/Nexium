import { combineReducers } from '@reduxjs/toolkit';
import menuReducer from '../slices/menuSlice';
import businessOwnerReducer from '../slices/businessOwnerSlice';
import superAdminReducer from '../slices/superAdminSlice';
import managerReducer from '../slices/managerSlice';
import employeeReducer from '../slices/employeeSlice';
import otpReducer from '../slices/otpSlice';
import leaveReducer from '../slices/leaveSlice';
import taskReducer from '../slices/taskSlice';
import myTaskReducer from '../slices/myTaskSlice';
import { RESET_STORE } from './resetAction';


const appReducer = combineReducers({
  menu: menuReducer,
  businessOwner: businessOwnerReducer,
  superAdmin: superAdminReducer,
  manager:managerReducer,
  employee: employeeReducer,
  otp: otpReducer,
  leave: leaveReducer,
  task: taskReducer,
  myTask: taskReducer
});

const rootReducer = (state: any, action: any) => {
  if (action.type === RESET_STORE) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
