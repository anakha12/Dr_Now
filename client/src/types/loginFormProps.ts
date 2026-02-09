import { ZodType } from "zod";

export interface LoginFormProps {
  title: string;
  subTitle: string;
  schema: ZodType<any>;
  loginService: (email: string, password: string) => Promise<any>;
  setAuth: (payload: { isAuthenticated: boolean; user: any }) => any;
  redirectPath: string;
  placeholders?: {
    email?: string;
    password?: string;
  };
}