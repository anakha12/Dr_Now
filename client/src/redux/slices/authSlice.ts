import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Draft } from "immer";
import type { Doctor, User, Admin } from "../../types/auth"; 

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
      setAuth: (
        state,
        action: PayloadAction<{ isAuthenticated: boolean; user?: T }>
      ) => {
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
const doctorSlice = createAuthSlice<Doctor>("doctorAuth");
export const {
  setAuth: setDoctorAuth,
  setLoading: setDoctorLoading,
  logout: doctorLogout,
} = doctorSlice.actions;

// --- User ---
const userSlice = createAuthSlice<User>("userAuth");
export const {
  setAuth: setUserAuth,
  setLoading: setUserLoading,
  logout: userLogout,
} = userSlice.actions;

// --- Admin ---
const adminSlice = createAuthSlice<Admin>("adminAuth");
export const {
  setAuth: setAdminAuth,
  setLoading: setAdminLoading,
  logout: adminLogout,
} = adminSlice.actions;

export const doctorAuthReducer = doctorSlice.reducer;
export const userAuthReducer = userSlice.reducer;
export const adminAuthReducer = adminSlice.reducer;
