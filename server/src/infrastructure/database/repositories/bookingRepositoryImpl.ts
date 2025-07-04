// src/infrastructure/database/repositories/BookingRepositoryImpl.ts

import BookingModel, { IBooking } from "../../database/models/bookingModel";
import { BookingRepository } from "../../../domain/repositories/bookingRepository";
import { Booking,EnrichedBooking, EnrichedDoctorBooking } from "../../../domain/entities/bookingEntity";
import { Types } from "mongoose";
import userModel from "../models/userModel";

export class BookingRepositoryImpl implements BookingRepository {

  async hasActiveBookingsForDoctor(doctorId: string): Promise<boolean> {
    const existing = await BookingModel.exists({
      doctorId: new Types.ObjectId(doctorId),
      status:"Upcoming",
    });

    return !!existing;
  }


  async updateRefundStatus(bookingId: string, status: string): Promise<void> {
    await BookingModel.findByIdAndUpdate(bookingId, { refundStatus: status });
  }


  async markPayoutAsPaid(bookingIds: string[]): Promise<void> {
    await BookingModel.updateMany(
      { _id: { $in: bookingIds } },
      { $set: { payoutStatus: "Paid" } }
    );
  }


  async getPaidBookings(): Promise<Booking[]> {
    const bookings = await BookingModel.find({ paymentStatus: "paid" });

    return bookings.map((b) => ({
      id: b.id,
      doctorId: b.doctorId.toString(),
      userId: b.userId.toString(),
      date: b.date,
      slot: b.slot,
      paymentStatus: b.paymentStatus,
      transactionId: b.transactionId,
      status: b.status,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      doctorEarning: b.doctorEarning,
      commissionAmount: b.commissionAmount,
      payoutStatus: b.payoutStatus,
      refundStatus: b.refundStatus
    }));
  }


  async getDoctorBookings(doctorId: string): Promise<EnrichedDoctorBooking[]> {
    const bookings = await BookingModel.find({
      doctorId: new Types.ObjectId(doctorId),
    })
      .populate("userId", "name")  
      .sort({ createdAt: -1 });

    return bookings.map((booking) => {
      const user = booking.userId as any;

      return {
        id: booking.id,
        doctorId: booking.doctorId.toString(),
        userId: booking.userId.toString(),
        patientName: user.name, 
        date: booking.date,
        slot: booking.slot,
        paymentStatus: booking.paymentStatus,
        transactionId: booking.transactionId,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        status: booking.status,
        doctorEarning: booking.doctorEarning,  
        payoutStatus: booking.payoutStatus 
      };
    });
  }




  async findById(bookingId: string): Promise<Booking | null> {
    const found = await BookingModel.findById(bookingId);
    if (!found) return null;

    const booking = found as IBooking;

    return {
      id: booking.id,
      doctorId: booking.doctorId.toString(),
      userId: booking.userId.toString(),
      date: booking.date,
      slot: booking.slot,
      paymentStatus: booking.paymentStatus,
      transactionId: booking.transactionId,
      status: booking.status, 
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      commissionAmount: booking.commissionAmount,
      doctorEarning: booking.doctorEarning,

    };
  }

async cancelBooking(bookingId: string): Promise<void> {
  await BookingModel.findByIdAndUpdate(bookingId, {
    status: "Cancelled",
    doctorEarning: 0,
    commissionAmount: 0
  });
}



  async getBookedSlotsByDoctorAndDate(doctorId: string,date: string): Promise<{ from: string; to: string }[]> {
    const bookings = await BookingModel.find({
      doctorId: new Types.ObjectId(doctorId),
      date,
    }).select("slot -_id");

    return bookings.map((b) => b.slot);
  }

  async createBooking(booking: Booking): Promise<Booking> {
    const created: IBooking = await BookingModel.create({
      doctorId: new Types.ObjectId(booking.doctorId),
      userId: new Types.ObjectId(booking.userId),
      date: booking.date,
      slot: booking.slot,
      paymentStatus: booking.paymentStatus,
      transactionId: booking.transactionId,
      status: "Upcoming", 
      commissionAmount: booking.commissionAmount, 
      doctorEarning: booking.doctorEarning 
    });

    return {
      id: created.id,
      doctorId: created.doctorId.toString(),
      userId: created.userId.toString(),
      date: created.date,
      slot: created.slot,
      paymentStatus: created.paymentStatus,
      transactionId: created.transactionId,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      status: created.status,
      commissionAmount: created.commissionAmount,  
      doctorEarning: created.doctorEarning   
    };
  }

  async findBookingBySlot(
    doctorId: string,
    date: string,
    slotFrom: string
  ): Promise<Booking | null> {
    const found = await BookingModel.findOne({
      doctorId: new Types.ObjectId(doctorId),
      date,
      "slot.from": slotFrom,
    });

    if (!found) return null;

    const booking = found as IBooking;

    return {
      id: booking.id,
      doctorId: booking.doctorId.toString(),
      userId: booking.userId.toString(),
      date: booking.date,
      slot: booking.slot,
      paymentStatus: booking.paymentStatus,
      transactionId: booking.transactionId,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      status: booking.status,
    };
  }
  async findUserBookings(userId: string): Promise<EnrichedBooking[]> {
    const found = await BookingModel.find({
      userId: new Types.ObjectId(userId),
    })
      .populate("doctorId", "name department") 
      .sort({ createdAt: -1 });

    return found.map((doc) => {
      const booking = doc as IBooking;
      const doctor = booking.doctorId as any;

      return {
        id: booking.id,
        doctorId: booking.doctorId.toString(),
        doctorName: doctor.name,              
        department: doctor.department,       
        userId: booking.userId.toString(),
        date: booking.date,
        slot: booking.slot,
        paymentStatus: booking.paymentStatus,
        transactionId: booking.transactionId,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        status: booking.status,
      };
    });
  }


  async updatePaymentStatus(
    bookingId: string,
    status: "paid" | "failed",
    transactionId?: string
  ): Promise<void> {
    await BookingModel.findByIdAndUpdate(bookingId, {
      paymentStatus: status,
      transactionId,
    });
  }
}
