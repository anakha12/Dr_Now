import { ZodType } from "zod";
import type { ActionCreatorWithPayload } from "@reduxjs/toolkit";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFormProps<TUser> {
  title: string;
  subTitle: string;
  schema: ZodType<LoginFormValues>;
  loginService: (email: string, password: string) => Promise<LoginResponse<TUser>>;
  setAuth: ActionCreatorWithPayload<{ isAuthenticated: boolean; user: TUser }, string>;
  redirectPath: string;
  placeholders?: {
    email?: string;
    password?: string;
  };
}

export interface LoginResponse<TUser> {
  token: string;
  user: TUser;
}

// User types
export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "admin";
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  role: "doctor";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user";
}
