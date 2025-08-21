export interface IGetUserWallet {
  execute(userId: string, page: number, limit: number): Promise<any>;
}
