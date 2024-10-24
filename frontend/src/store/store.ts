// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default storage for web
import menuReducer from '../features/menuSlice';
import businessOwnerReducer from '../features/businessOwnerSlice';
import superAdminReducer from '../features/superAdminSlice';


const persistConfig = {
  key: 'root',
  storage,
};


const persistedBusinessOwnerReducer = persistReducer(persistConfig, businessOwnerReducer);
const persistedsuperAdminReducer = persistReducer(persistConfig, superAdminReducer);

const store = configureStore({
  reducer: {
    menu: menuReducer,
    businessOwner: persistedBusinessOwnerReducer,
    superAdmin: persistedsuperAdminReducer,
  },
});


const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;


export { store, persistor };
