export interface IUserLogout {
  execute(): Promise<{ message: string }>;
}
