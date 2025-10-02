
import { WalletTransactionUser } from "./walletTransactionUserEntity";


export interface UserEntity {
  id?: string;
  name: string;
  email: string;
  age: string;
  gender: string;
  phone: string;
  dateOfBirth: Date;
  image: string;
  password?: string;
  bloodGroup: string;
  address: string;
  isBlocked: boolean;
  isVerified?: boolean;
  googleId?: string;
  role: string;
  otp?: string; 
  otpExpiresAt?: Date;
  isDonner: boolean;
  profileCompletion: boolean;
  uid?: string; 
  walletBalance?: number;
  walletTransactions?: WalletTransactionUser[];
}
