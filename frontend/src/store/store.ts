// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default storage for web
import menuReducer from '../features/menuSlice';
import businessOwnerReducer from '../features/businessOwnerSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

// Create a persisted reducer for the businessOwner
const persistedBusinessOwnerReducer = persistReducer(persistConfig, businessOwnerReducer);

// Configure the Redux store
const store = configureStore({
  reducer: {
    menu: menuReducer,
    businessOwner: persistedBusinessOwnerReducer,
  },
});

// Create a persistor for the store
const persistor = persistStore(store);

// Define RootState type for TypeScript
export type RootState = ReturnType<typeof store.getState>;

// Export the store and persistor
export { store, persistor };
