import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Draft } from "immer";


export interface AuthState<UserType> {
  isAuthenticated: boolean;
  loading: boolean;
  user?: UserType;
}

function createAuthSlice<T extends object>(name: string) {
  const initialState: AuthState<T> = {
    isAuthenticated: false,
    loading: true,
    user: undefined,
  };

  const slice = createSlice({
    name,
    initialState,
    reducers: {
      setAuth: (state, action: PayloadAction<{ isAuthenticated: boolean; user?: T }>) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user as Draft<T>;
      },
      setLoading: (state, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
      },
      logout: (state) => {
        state.isAuthenticated = false;
        state.user = undefined;
      },
    },
  });

  return slice;
}

// --- Doctor ---
export interface Doctor {
  id: string;
  email: string;
  role: "doctor";
}
const doctorSlice = createAuthSlice<Doctor>("doctorAuth");
export const { setAuth: setDoctorAuth, setLoading: setDoctorLoading, logout: doctorLogout } = doctorSlice.actions;

// --- User ---
export interface User {
  id: string;
  email: string;
  role: "user";
}
const userSlice = createAuthSlice<User>("userAuth");
export const { setAuth: setUserAuth, setLoading: setUserLoading, logout: userLogout } = userSlice.actions;


// --- Admin ---
export interface Admin {
  id: string;
  email: string;
  role: "admin";
}
const adminSlice = createAuthSlice<Admin>("adminAuth");
export const { setAuth: setAdminAuth, setLoading: setAdminLoading, logout: adminLogout } = adminSlice.actions;


export const doctorAuthReducer = doctorSlice.reducer;
export const userAuthReducer = userSlice.reducer;
export const adminAuthReducer = adminSlice.reducer;
