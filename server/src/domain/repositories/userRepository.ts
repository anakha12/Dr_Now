
import { WalletTransactionUser } from "../entities/walletTransactionUserEntity";
import { UpdateQuery } from "mongoose";
import { UserEntity } from "../entities/userEntity";

export interface UserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  createUser(user: UserEntity): Promise<UserEntity>;
  updateUser(id: string, updates: UpdateQuery<UserEntity>): Promise<UserEntity>;
  updateUserByEmail(email: string, user: Partial<UserEntity>): Promise<UserEntity>; 
  getAllUsers(): Promise<UserEntity[]>;
  toggleBlockStatus(userId: string, block: boolean): Promise<UserEntity>;
  findUserById(userId: string): Promise<UserEntity | null>;
  updateUserWalletAndTransactions(userId: string, amount: number, transaction: WalletTransactionUser): Promise<void>;

}
