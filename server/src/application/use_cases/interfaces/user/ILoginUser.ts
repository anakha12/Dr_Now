export interface ILoginUser {
  execute(email: string, password: string): Promise<{ token: string; user: any }>;
}
