import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './rootReducer'; // Make sure this file exists or define the reducers directly

// Persist configurations
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['menu', 'businessOwner', 'superAdmin' ,'manager'], // Only persist these slices
};

// Apply persistence to root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disabling serializable check for persist
    }),
});

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
