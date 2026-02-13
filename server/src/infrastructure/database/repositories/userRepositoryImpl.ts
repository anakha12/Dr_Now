import UserModel, {IUSER} from "../models/userModel";
import { IUserRepository } from "../../../domain/repositories/userRepository";
import { UserEntity } from "../../../domain/entities/userEntity";
import { WalletTransactionUser } from "../../../domain/entities/walletTransactionUserEntity";
import { ErrorMessages, Messages } from "../../../utils/Messages";
import { Role } from "../../../utils/Constance";
import { BaseRepository } from "../../../domain/repositories/baseRepository";
import { Document, Types } from "mongoose";

type UserDoc = IUSER & Document;

export class UserRepositoryImpl
  extends BaseRepository< UserDoc>
  implements IUserRepository
{
  constructor() {
    super(UserModel); 
  }


async findByEmailOrUid(email: string, uid: string): Promise<UserEntity | null> {
  const user = await UserModel.findOne({
    $or: [
      { uid },   
      { email }, 
    ],
  });

  return user ? this._toDomain(user) : null;
}



  async getFilteredUsers(
    filters: { search?: string; gender?: string; minAge?: number; maxAge?: number },
    skip: number,
    limit: number,
    sort: Record<string, 1 | -1>
  ): Promise<UserEntity[]> {
    const dbFilters: Record<string, any> = { role: Role.USER }; 

    if (filters.search) {
      dbFilters.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { email: { $regex: filters.search, $options: "i" } },
        { phone: { $regex: filters.search, $options: "i" } },
      ];
    }

    if (filters.gender) dbFilters.gender = filters.gender;

    if (filters.minAge || filters.maxAge) {
      dbFilters.age = {} as Record<string, number>;
      if (filters.minAge !== undefined) dbFilters.age.$gte = filters.minAge;
      if (filters.maxAge !== undefined) dbFilters.age.$lte = filters.maxAge;
    }

    const users = await UserModel.find(dbFilters)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return users.map(this._toDomain);
  }

  async countFilteredUsers(filters: { search?: string; gender?: string; minAge?: number; maxAge?: number }): Promise<number> {
    const dbFilters: Record<string, any> = { role: Role.USER };

    if (filters.search) {
      dbFilters.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { email: { $regex: filters.search, $options: "i" } },
        { phone: { $regex: filters.search, $options: "i" } },
      ];
    }

    if (filters.gender) dbFilters.gender = filters.gender;

    if (filters.minAge || filters.maxAge) {
      dbFilters.age = {} as Record<string, number>;
      if (filters.minAge !== undefined) dbFilters.age.$gte = filters.minAge;
      if (filters.maxAge !== undefined) dbFilters.age.$lte = filters.maxAge;
    }

    return UserModel.countDocuments(dbFilters);
  }

 async getPaginatedWallet(
  userId: string,
  page: number,
  limit: number
): Promise<{
  walletBalance: number;
  walletTransactions: WalletTransactionUser[];
  totalTransactions: number;
}> {
  const user = await UserModel.findById(userId).lean();
  if (!user) throw new Error( ErrorMessages.USER_NOT_FOUND );

  const allTransactions = user.walletTransactions || [];

  const sorted = allTransactions.sort(
    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const skip = (page - 1) * limit;
  const paginated = sorted.slice(skip, skip + limit);

  return {
    walletBalance: user.walletBalance || 0,
    walletTransactions: paginated as WalletTransactionUser[],
    totalTransactions: sorted.length,
  };
}


  async updateUserWalletAndTransactions(
    userId: string,
    amount: number,
    transaction: WalletTransactionUser
  ): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $inc: { walletBalance: amount },
      $push: { walletTransactions: transaction },
    });
  }

  async findUserById(userId: string): Promise<UserEntity | null> {
    const user = await this.findById(userId); 
    return user ? this._toDomain(user) : null;
  }

  async getAllUsers(): Promise<UserEntity[]> {
    const users = await UserModel.find({ role: Role.USER});
    return users.map(this._toDomain);
  }

  async toggleBlockStatus(userId: string, block: boolean): Promise<UserEntity> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isBlocked: block },
      { new: true }
    );
    if (!updatedUser) throw new Error( ErrorMessages.USER_NOT_FOUND );
    return this._toDomain(updatedUser);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await UserModel.findOne({ email });
    return user ? this._toDomain(user) : null;
  }


async createUser(userData: UserEntity): Promise<UserEntity> {
  const mappedData: Partial<UserDoc> = {
    ...userData,
     uid: userData.uid,
    walletTransactions: userData.walletTransactions?.map(tx => ({
      ...tx,
      bookingId: tx.bookingId ? new Types.ObjectId(tx.bookingId) : undefined,
    })),
  };

  const newUser = await this.create(mappedData);
  return this._toDomain(newUser);
}
  async updateUserByEmail(email: string, updates: Partial<UserEntity>): Promise<UserEntity> {
    const updatedUser = await UserModel.findOneAndUpdate({ email }, updates, { new: true });
    if (!updatedUser) throw new Error( ErrorMessages.USER_NOT_FOUND );
    return this._toDomain(updatedUser);
  }

  async updateUser(id: string, updates: Partial<UserEntity>): Promise<UserEntity> {

    const mappedUpdates: Partial<UserDoc> = {
      ...updates,
      walletTransactions: updates.walletTransactions?.map(tx => ({
        ...tx,
        bookingId: tx.bookingId ? new Types.ObjectId(tx.bookingId) : undefined,
      })),
    };
    const updatedUser = await this.updateById(id, mappedUpdates); 
    if (!updatedUser) throw new Error(ErrorMessages.USER_NOT_FOUND);
    return this._toDomain(updatedUser);
  }

  async updateUserProfile(userId: string, updates: Partial<UserEntity>): Promise<UserEntity> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true } 
    );

    if (!updatedUser) {
      throw new Error(Messages.USER_NOT_FOUND);
    }

    return this._toDomain(updatedUser);
  }


  private _toDomain(user: any): UserEntity {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      age: user.age,
      profileCompletion: user.profileCompletion,
      gender: user.gender,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      image: user.image,
      password: user.password,
      isBlocked: user.isBlocked,
      bloodGroup: user.bloodGroup,
      address: user.address,
      isDonner: user.isDonner,
      otp: user.otp,
      role: user.role,
      otpExpiresAt: user.otpExpiresAt,
      isVerified: user.isVerified,
      walletBalance: user.walletBalance,
      walletTransactions: user.walletTransactions,
    };
  }
}
