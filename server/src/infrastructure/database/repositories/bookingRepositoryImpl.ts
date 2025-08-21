

import BookingModel, { IBooking } from "../../database/models/bookingModel";
import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { Booking,EnrichedBooking, EnrichedDoctorBooking } from "../../../domain/entities/bookingEntity";
import { Types } from "mongoose";
import userModel from "../models/userModel";

export class BookingRepositoryImpl implements IBookingRepository {


async getDoctorsWithPendingEarnings(
  page: number,
  limit: number
): Promise<{
  doctors: { doctorId: string; doctorName: string; totalPendingEarnings: number }[];
  totalPages: number;
}> {
  const skip = (page - 1) * limit;

 
  const totalDoctorsResult = await BookingModel.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        payoutStatus: "Pending",
        doctorEarning: { $gt: 0 },
        status: { $in: ["Completed", "Upcoming"] },
      },
    },
    {
      $group: {
        _id: "$doctorId",
      },
    },
    {
      $count: "total",
    },
  ]);

  const totalDoctors = totalDoctorsResult[0]?.total || 0;
  const totalPages = Math.ceil(totalDoctors / limit);

  // Step 2: Get paginated doctor data with earnings
  const doctors = await BookingModel.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        payoutStatus: "Pending",
        doctorEarning: { $gt: 0 },
        status: { $in: ["Completed", "Upcoming"] },
      },
    },
    {
      $group: {
        _id: "$doctorId",
        totalPendingEarnings: { $sum: "$doctorEarning" },
      },
    },
    {
      $sort: { totalPendingEarnings: -1 },
    },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "doctors",
        localField: "_id",
        foreignField: "_id",
        as: "doctor",
      },
    },
    { $unwind: "$doctor" },
    {
      $project: {
        doctorId: { $toString: "$_id" },
        doctorName: "$doctor.name",
        totalPendingEarnings: 1,
      },
    },
  ]);

  return {
    doctors,
    totalPages,
  };
}



  async findBookingByIdAndDoctor(bookingId: string, doctorId: string): Promise<EnrichedBooking | null> {
  const found = await BookingModel.findOne({
    _id: new Types.ObjectId(bookingId),
    doctorId: new Types.ObjectId(doctorId)
  }).populate("doctorId", "name specialization")
    .populate("userId","name")

  if (!found) return null;

  const doctor = found.doctorId as any;
  const user = found.userId as any;
  return {
    id: found.id,
    doctorId: found.doctorId.toString(),
    doctorName: doctor.name,
    department: doctor.specialization,
    userId: found.userId.toString(),
    patientName:user.name,
    date: found.date,
    slot: found.slot,
    paymentStatus: found.paymentStatus,
    transactionId: found.transactionId,
    createdAt: found.createdAt,
    updatedAt: found.updatedAt,
    status: found.status,
    doctorEarning: found.doctorEarning ?? 0,
    commissionAmount: found.commissionAmount ?? 0,
    payoutStatus: found.payoutStatus,
    refundStatus: found.refundStatus,
    cancellationReason: found.cancellationReason,
  };
}


async findBookingByIdAndUser(bookingId: string, userId: string): Promise<EnrichedBooking | null> {
  const found = await BookingModel.findOne({
    _id: new Types.ObjectId(bookingId),
    userId: new Types.ObjectId(userId)
  }).populate("doctorId", "name specialization")
    .populate("userId", "name")

  if (!found) return null;

  const doctor = found.doctorId as any;
  const user = found.userId as any;
  return {
    id: found.id,
    doctorId: found.doctorId.toString(),
    doctorName: doctor.name,
    department: doctor.specialization,
    userId: found.userId.toString(),
    patientName:user.name,
    date: found.date,
    slot: found.slot,
    paymentStatus: found.paymentStatus,
    transactionId: found.transactionId,
    createdAt: found.createdAt,
    updatedAt: found.updatedAt,
    status: found.status,
    doctorEarning: found.doctorEarning ?? 0,
    commissionAmount: found.commissionAmount ?? 0,
    payoutStatus: found.payoutStatus,
    refundStatus: found.refundStatus
  };
}


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


 async getDoctorBookings(doctorId: string, page: number, limit: number): Promise<{ bookings: EnrichedDoctorBooking[], totalPages: number }> {
  const skip = (page - 1) * limit;

  const totalCount = await BookingModel.countDocuments({
    doctorId: new Types.ObjectId(doctorId),
  });

  const bookings = await BookingModel.find({
    doctorId: new Types.ObjectId(doctorId),
  })
    .populate("userId", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const mappedBookings = bookings.map((booking) => {
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
      payoutStatus: booking.payoutStatus,
      commissionAmount: booking.commissionAmount ?? 0,
    };
  });

  const totalPages = Math.ceil(totalCount / limit);

  return { bookings: mappedBookings, totalPages };
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

  async cancelBooking(bookingId: string, reason?: string): Promise<void> {
    await BookingModel.findByIdAndUpdate(bookingId, {
      status: "Cancelled",
      doctorEarning: 0,
      commissionAmount: 0,
      cancellationReason: reason || null,
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
async findUserBookings(userId: string, page: number, limit: number): Promise<{ bookings: EnrichedBooking[], total: number }> {
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    BookingModel.find({ userId: new Types.ObjectId(userId) })
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    BookingModel.countDocuments({ userId: new Types.ObjectId(userId) }),
  ]);

  const transformed = bookings.map((doc) => {
    const booking = doc as IBooking;
    const doctor = booking.doctorId as any;
    const user = booking.userId as any;
    return {
      id: booking.id,
      doctorId: booking.doctorId.toString(),
      doctorName: doctor.name,
      department: doctor.specialization,
      userId: booking.userId.toString(),
      patientName: user.name,
      date: booking.date,
      slot: booking.slot,
      paymentStatus: booking.paymentStatus,
      transactionId: booking.transactionId,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      status: booking.status,
      doctorEarning: booking.doctorEarning ?? 0,
      commissionAmount: booking.commissionAmount ?? 0
    };
  });

  return { bookings: transformed, total };
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
