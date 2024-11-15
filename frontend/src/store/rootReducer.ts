// src/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import menuReducer from '../features/menuSlice';
import businessOwnerReducer from '../features/businessOwnerSlice';
import superAdminReducer from '../features/superAdminSlice';
import managerReducer from '../features/managerSlice';
import { RESET_STORE } from './resetAction';

// Root reducer with reset logic
const appReducer = combineReducers({
  menu: menuReducer,
  businessOwner: businessOwnerReducer,
  superAdmin: superAdminReducer,
  manager:managerReducer
});

const rootReducer = (state: any, action: any) => {
  if (action.type === RESET_STORE) {
    // When RESET_STORE action is dispatched, reset all states
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
