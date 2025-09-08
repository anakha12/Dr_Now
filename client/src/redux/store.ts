import { configureStore } from "@reduxjs/toolkit";
import { doctorAuthReducer, userAuthReducer, adminAuthReducer } from "./slices/authSlice";


export const store = configureStore({
  reducer: {
    doctorAuth: doctorAuthReducer,
    userAuth: userAuthReducer,
    adminAuth: adminAuthReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
