import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Doctor, User, Admin } from "../../types/auth";

// -------------------- USER --------------------
interface UserAuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
}

const initialUserState: UserAuthState = {
  isAuthenticated: false,
  loading: true,
  user: null,
};

const userSlice = createSlice({
  name: "userAuth",
  initialState: initialUserState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ isAuthenticated: boolean; user: User }>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setAuth: setUserAuth, setLoading: setUserLoading, logout: userLogout } = userSlice.actions;
export const userAuthReducer = userSlice.reducer;

// -------------------- DOCTOR --------------------
interface DoctorAuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: Doctor | null;
}

const initialDoctorState: DoctorAuthState = {
  isAuthenticated: false,
  loading: true,
  user: null,
};

const doctorSlice = createSlice({
  name: "doctorAuth",
  initialState: initialDoctorState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ isAuthenticated: boolean; user: Doctor }>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setAuth: setDoctorAuth, setLoading: setDoctorLoading, logout: doctorLogout } = doctorSlice.actions;
export const doctorAuthReducer = doctorSlice.reducer;

// -------------------- ADMIN --------------------
interface AdminAuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: Admin | null;
}

const initialAdminState: AdminAuthState = {
  isAuthenticated: false,
  loading: true,
  user: null,
};

const adminSlice = createSlice({
  name: "adminAuth",
  initialState: initialAdminState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ isAuthenticated: boolean; user: Admin }>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setAuth: setAdminAuth, setLoading: setAdminLoading, logout: adminLogout } = adminSlice.actions;
export const adminAuthReducer = adminSlice.reducer;