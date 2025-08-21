export interface IGoogleLoginUser {
  execute(data: { email: string; name?: string; uid: string }): Promise<any>;
}
