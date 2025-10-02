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

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userAuth"],
};

const persistedUserReducer = persistReducer(persistConfig, userAuthReducer);

export const store = configureStore({
  reducer: {
    userAuth: persistedUserReducer,
    doctorAuth: doctorAuthReducer,
    adminAuth: adminAuthReducer,
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
