

import { AdminWalletRepository } from "../../../domain/repositories/adminWalletRepository";
import { AdminWalletTransaction } from "../../../domain/entities/adminWalletEntity";
import AdminWalletModel from "../models/adminWalletModel";
import mongoose from "mongoose";

export class AdminWalletRepositoryImpl implements AdminWalletRepository {

  async createTransaction(transaction: AdminWalletTransaction): Promise<void> {
    await this.creditCommission(transaction, -transaction.amount); 
  }


  async getSummary(): Promise<{ totalBalance: number; transactionCount: number }> {
    const wallet = await AdminWalletModel.findOne();
    if (!wallet) {
      return {
        totalBalance: 0,
        transactionCount: 0,
      };
    }

    return {
      totalBalance: wallet.totalBalance,
      transactionCount: wallet.transactions.length,
    };
  }

  async creditCommission(transaction: AdminWalletTransaction, amount: number): Promise<void> {
    const existingWallet = await AdminWalletModel.findOne();

    if (existingWallet) {
      existingWallet.totalBalance += amount;
      existingWallet.transactions.push({
        ...transaction,
        date: new Date(),
        type: "credit",
        amount,
        doctorId: transaction.doctorId ? new mongoose.Types.ObjectId(transaction.doctorId) : undefined,
        userId: transaction.userId ? new mongoose.Types.ObjectId(transaction.userId) : undefined,
        bookingId: transaction.bookingId ? new mongoose.Types.ObjectId(transaction.bookingId) : undefined,
      });
      await existingWallet.save();
    } else {
      await AdminWalletModel.create({
        totalBalance: amount,
        transactions: [
          {
            ...transaction,
            date: new Date(),
            type: "credit",
            amount,
            doctorId: transaction.doctorId ? new mongoose.Types.ObjectId(transaction.doctorId) : undefined,
            userId: transaction.userId ? new mongoose.Types.ObjectId(transaction.userId) : undefined,
            bookingId: transaction.bookingId ? new mongoose.Types.ObjectId(transaction.bookingId) : undefined,
          },
        ],
      });
    }
  }
}
