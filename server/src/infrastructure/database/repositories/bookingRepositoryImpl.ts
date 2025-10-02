import mongoose from "mongoose";
import BookingModel, { IBooking } from "../models/booking.model";
import { Booking } from "../../../domain/entities/booking.entity";
import { IBookingRepository } from "../../../domain/repositories/bookingRepository";

interface IPopulatedDoctor {
  _id: mongoose.Types.ObjectId;
  name: string;
  specialization: string;
}

type IBookingWithPopulatedDoctor = Omit<IBooking, "doctorId"> & {
  doctorId: mongoose.Types.ObjectId | IPopulatedDoctor;
};

export class BookingRepositoryImpl implements IBookingRepository {
  async createBooking(booking: Booking): Promise<Booking> {
    const newBooking = new BookingModel({
      doctorId: booking.doctorId,
      userId: booking.userId,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      transactionId: booking.transactionId,
      doctorEarning: booking.doctorEarning,
      commissionAmount: booking.commissionAmount,
      payoutStatus: booking.payoutStatus,
      refundStatus: booking.refundStatus,
      cancellationReason: booking.cancellationReason || "",
    });

    const saved = await newBooking.save();
    return this._toDomain(saved);
  }

  async findBookingById(id: string): Promise<Booking | null> {
    const booking = await BookingModel.findById(id).populate(
      "doctorId",
      "name specialization"
    );
    return booking ? this._toDomain(booking) : null;
  }

  async getDoctorBookings(
    doctorId: string,
    page: number,
    limit: number
  ): Promise<{ bookings: Booking[]; totalPages: number }> {
    const skip = (page - 1) * limit;
    const [bookings, total] = await Promise.all([
      BookingModel.find({ doctorId })
        .populate("doctorId", "name specialization")
        .populate("userId", "name")
        .sort({ date: -1, startTime: 1 })
        .skip(skip)
        .limit(limit),
      BookingModel.countDocuments({ doctorId }),
    ]);

    return {
      bookings: bookings.map(this._toDomain),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBookingByIdAndDoctor(id: string, doctorId: string): Promise<Booking | null> {
    const booking = await BookingModel.findOne({ _id: id, doctorId })
      .populate("doctorId", "name specialization")
      .populate("userId", "name");

    return booking ? this._toDomain(booking) : null;
  }


  async findBookingByIdAndUser(id: string, userId: string): Promise<Booking | null> {
    const booking = await BookingModel.findOne({ _id: id, userId }).populate(
      "doctorId",
      "name specialization"
    );
    return booking ? this._toDomain(booking) : null;
  }

  async updateBooking(booking: Booking): Promise<Booking> {
    const updated = await BookingModel.findByIdAndUpdate(
      booking.id,
      { ...booking },
      { new: true }
    ).populate("doctorId", "name specialization");

    if (!updated) throw new Error("Booking not found");
    return this._toDomain(updated);
  }

  async isSlotAvailable(
    doctorId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    const overlappingBooking = await BookingModel.findOne({
      doctorId,
      date,
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    });
    return !overlappingBooking;
  }

  async findUserBookings(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ bookings: Booking[]; total: number }> {
    const skip = (page - 1) * limit;
    const [bookings, total] = await Promise.all([
      BookingModel.find({ userId })
        .populate("doctorId", "name specialization")
        .sort({ date: -1, startTime: 1 })
        .skip(skip)
        .limit(limit),
      BookingModel.countDocuments({ userId }),
    ]);

    return {
      bookings: bookings.map(this._toDomain),
      total,
    };
  }

  async findBookingsByDoctorAndDate(
    doctorId: string,
    date: string
  ): Promise<Booking[]> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const bookings = await BookingModel.find({
      doctorId,
      date: { $gte: start.toISOString(), $lte: end.toISOString() },
    }).populate("doctorId", "name specialization");

    return bookings.map(this._toDomain);
  }

  // -----------------------------
  // CANCEL & REFUND METHODS
  // -----------------------------
  async cancelBooking(bookingId: string, reason: string): Promise<Booking | null> {
    const updated = await BookingModel.findByIdAndUpdate(
      bookingId,
      { status: "Cancelled", cancellationReason: reason },
      { new: true }
    ).populate("doctorId", "name specialization");

    if (!updated) throw new Error("Booking not found");
    return this._toDomain(updated);
  }

  async updateRefundStatus(bookingId: string, status: string): Promise<Booking | null> {
    const updated = await BookingModel.findByIdAndUpdate(
      bookingId,
      { refundStatus: status },
      { new: true }
    ).populate("doctorId", "name specialization");

    if (!updated) throw new Error("Booking not found");
    return this._toDomain(updated);
  }

  // -----------------------------
  // Mapper from persistence to domain
  // -----------------------------
  private _toDomain(booking: IBookingWithPopulatedDoctor): Booking {
  let doctorId: string;
  let doctorName: string | undefined;
  let department: string | undefined;
  let patientName: string | undefined;

  if (booking.doctorId instanceof mongoose.Types.ObjectId) {
    doctorId = booking.doctorId.toString();
  } else {
    doctorId = booking.doctorId._id.toString();
    doctorName = booking.doctorId.name;
    department = booking.doctorId.specialization;
  }

  if ((booking as any).userId?.name) {
    patientName = (booking as any).userId.name;
  }

  const entity = new Booking(
    doctorId,
    booking.userId.toString(),
    booking.date,
    booking.startTime,
    booking.endTime,
    booking.status,
    booking.paymentStatus,
    booking.transactionId,
    booking.doctorEarning,
    booking.commissionAmount,
    booking.payoutStatus,
    booking.refundStatus,
    booking.cancellationReason,
    booking._id.toString()
  );

  (entity as any).doctorName = doctorName;
  (entity as any).department = department;
  (entity as any).patientName = patientName;
  (entity as any).slot = { from: booking.startTime, to: booking.endTime };

  return entity;
}

}
