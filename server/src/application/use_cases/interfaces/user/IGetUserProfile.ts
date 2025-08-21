export interface IGetUserProfile {
  execute(userId: string): Promise<any>;
}
