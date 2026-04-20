import { configureStore } from "@reduxjs/toolkit";
import { doctorAuthReducer, userAuthReducer, adminAuthReducer } from "./slices/authSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const userPersistConfig = {
  key: "userAuth",
  storage,
};

const doctorPersistConfig = {
  key: "doctorAuth",
  storage,
};

const adminPersistConfig = {
  key: "adminAuth",
  storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userAuthReducer);
const persistedDoctorReducer = persistReducer(doctorPersistConfig, doctorAuthReducer);
const persistedAdminReducer = persistReducer(adminPersistConfig, adminAuthReducer);

export const store = configureStore({
  reducer: {
    userAuth: persistedUserReducer,
    doctorAuth: persistedDoctorReducer,
    adminAuth: persistedAdminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
