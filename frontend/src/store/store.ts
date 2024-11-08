// src/store/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import menuReducer from '../features/menuSlice';
import businessOwnerReducer from '../features/businessOwnerSlice';
import superAdminReducer from '../features/superAdminSlice';

// Define a reset action type
const RESET_STORE = 'RESET_STORE';

// Persist configurations
const businessOwnerPersistConfig = { key: 'businessOwner', storage };
const superAdminPersistConfig = { key: 'superAdmin', storage };
const menuPersistConfig = { key: 'menu', storage };

// Persist reducers
const persistedMenuReducer = persistReducer(menuPersistConfig, menuReducer);
const persistedBusinessOwnerReducer = persistReducer(businessOwnerPersistConfig, businessOwnerReducer);
const persistedSuperAdminReducer = persistReducer(superAdminPersistConfig, superAdminReducer);

// Combine reducers
const appReducer = combineReducers({
  menu: persistedMenuReducer,
  businessOwner: persistedBusinessOwnerReducer,
  superAdmin: persistedSuperAdminReducer,
});

// Root reducer with reset logic
const rootReducer = (state: any, action: any) => {
  if (action.type === RESET_STORE) {
    state = undefined; // Clear all states
  }
  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

const persistor = persistStore(store);

// Export a reset action to be dispatched where needed
export const resetStore = () => ({ type: RESET_STORE });

export type RootState = ReturnType<typeof store.getState>;
export { store, persistor };
