
import { WalletTransactionUser } from "../entities/walletTransactionUserEntity";
import { UpdateQuery } from "mongoose";
import { UserEntity } from "../entities/userEntity";

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  createUser(user: UserEntity): Promise<UserEntity>;
  updateUser(id: string, updates: UpdateQuery<UserEntity>): Promise<UserEntity>;
  updateUserByEmail(email: string, user: Partial<UserEntity>): Promise<UserEntity>; 
  getAllUsers(): Promise<UserEntity[]>;
  getPaginatedUsers(page: number, limit: number): Promise<{
    users: UserEntity[];
    totalPages: number;
  }>;
  toggleBlockStatus(userId: string, block: boolean): Promise<UserEntity>;
  findUserById(userId: string): Promise<UserEntity | null>;
  updateUserWalletAndTransactions(userId: string, amount: number, transaction: WalletTransactionUser): Promise<void>;
  getPaginatedWallet(
  userId: string,
  page: number,
  limit: number
): Promise<{
  walletBalance: number;
  walletTransactions: WalletTransactionUser[];
  totalTransactions: number;
}>;


}
