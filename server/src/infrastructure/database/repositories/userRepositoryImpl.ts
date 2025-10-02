import UserModel from "../models/userModel";
import { IUserRepository } from "../../../domain/repositories/userRepository";
import { UserEntity } from "../../../domain/entities/userEntity";
import { WalletTransactionUser } from "../../../domain/entities/walletTransactionUserEntity";
import { ErrorMessages, Messages } from "../../../utils/Messages";

export class UserRepositoryImpl implements IUserRepository {

  async getPaginatedUsers(page: number, limit: number, search: string= ""): Promise<{
    users: UserEntity[];
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const searchFilter = search
    ? {
        role: "user",
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      }
    : { role: "user" };
    const totalUsers = await UserModel.countDocuments(searchFilter);
    const users = await UserModel.find(searchFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      users: users.map(this._toDomain),
      totalPages: Math.ceil(totalUsers / limit),
    };
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
    const user = await UserModel.findById(userId);
    return user ? this._toDomain(user) : null;
  }

  async getAllUsers(): Promise<UserEntity[]> {
    const users = await UserModel.find({ role: "user" });
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
    const newUser = new UserModel(userData);
    const savedUser = await newUser.save();
    return this._toDomain(savedUser);
  }

  async updateUserByEmail(email: string, updates: Partial<UserEntity>): Promise<UserEntity> {
    const updatedUser = await UserModel.findOneAndUpdate({ email }, updates, { new: true });
    if (!updatedUser) throw new Error( ErrorMessages.USER_NOT_FOUND );
    return this._toDomain(updatedUser);
  }

  async updateUser(id: string, updates: Partial<UserEntity>): Promise<UserEntity> {
    const updatedUser = await UserModel.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedUser) throw new Error( ErrorMessages.USER_NOT_FOUND );
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
