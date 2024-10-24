// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import menuReducer from '../features/menuSlice';
import businessOwnerReducer from '../features/businessOwnerSlice';
import superAdminReducer from '../features/superAdminSlice';

const businessOwnerPersistConfig = {
  key: 'businessOwner',
  storage,
};

// Persist config for super admin
const superAdminPersistConfig = {
  key: 'superAdmin',
  storage,
};

const menuPersistConfig = {
  key: 'menu',
  storage,
}


const persistedMenuReducer = persistReducer(menuPersistConfig, menuReducer);
const persistedBusinessOwnerReducer = persistReducer(businessOwnerPersistConfig, businessOwnerReducer);
const persistedSuperAdminReducer = persistReducer(superAdminPersistConfig, superAdminReducer);

const store = configureStore({
  reducer: {
    menu: persistedMenuReducer,
    businessOwner: persistedBusinessOwnerReducer,
    superAdmin: persistedSuperAdminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
       
      },
    }),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export { store, persistor };
