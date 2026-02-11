import { IAdminWalletRepository } from "../../../domain/repositories/adminWalletRepository";
import { AdminWalletTransaction } from "../../../domain/entities/adminWalletEntity";
import AdminWalletModel from "../models/adminWalletModel";
import mongoose from "mongoose";

export class AdminWalletRepositoryImpl implements IAdminWalletRepository {

  private _buildTransactionPayload(
    transaction: AdminWalletTransaction,
    type: 'credit' | 'debit',
    amount: number
  ) {
    return {
      ...transaction,
      type,
      amount,
      date: new Date(),
      doctorId: transaction.doctorId ? new mongoose.Types.ObjectId(transaction.doctorId) : undefined,
      userId: transaction.userId ? new mongoose.Types.ObjectId(transaction.userId) : undefined,
      bookingId: transaction.bookingId ? new mongoose.Types.ObjectId(transaction.bookingId) : undefined,
    };
  }

  async creditCommission(transaction: AdminWalletTransaction, amount: number): Promise<void> {
    const payload = this._buildTransactionPayload(transaction, "credit", amount);
    let wallet = await AdminWalletModel.findOne();

    if (wallet) {
      wallet.totalBalance += amount;
      wallet.transactions.push(payload);
      await wallet.save();
    } else {
      await AdminWalletModel.create({
        totalBalance: amount,
        transactions: [payload],
      });
    }
  }

  async debitCommission(transaction: AdminWalletTransaction, amount: number): Promise<void> {
    const payload = this._buildTransactionPayload(transaction, "debit", amount);
    let wallet = await AdminWalletModel.findOne();

    if (wallet) {
      wallet.totalBalance -= amount;
      wallet.transactions.push(payload);
      await wallet.save();
    } else {
      await AdminWalletModel.create({
        totalBalance: -amount,
        transactions: [payload],
      });
    }
  }

  async createTransaction(transaction: AdminWalletTransaction): Promise<void> {
    if (transaction.type === "credit") {
      await this.creditCommission(transaction, transaction.amount);
    } else {
      await this.debitCommission(transaction, transaction.amount);
    }
  }

  async getSummary(): Promise<{ totalBalance: number; transactionCount: number }> {
    const wallet = await AdminWalletModel.findOne();

    return {
      totalBalance: wallet?.totalBalance || 0,
      transactionCount: wallet?.transactions.length || 0,
    };
  }
}
