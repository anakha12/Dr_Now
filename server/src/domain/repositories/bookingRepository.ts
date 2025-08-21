import { Booking } from "../entities/bookingEntity";
import { EnrichedBooking } from "../entities/bookingEntity";

export interface IBookingRepository {
  createBooking(booking: Booking): Promise<Booking>;
  findById(bookingId: string): Promise<Booking | null>;
  findBookingBySlot(doctorId: string, date: string, slotFrom: string): Promise<Booking | null>;
  findUserBookings(userId: string, page: number, limit: number): Promise<{ bookings: EnrichedBooking[]; total: number }>;
  updatePaymentStatus(bookingId: string, status: 'paid' | 'failed', transactionId?: string): Promise<void>;
  getBookedSlotsByDoctorAndDate(doctorId: string,date: string): Promise<{ from: string; to: string }[]>;
  cancelBooking(bookingId: string,reason?: string): Promise<void>;
  getDoctorBookings(doctorId: string, page: number, limit: number): Promise<{ bookings: Booking[]; totalPages: number }>;
  getPaidBookings(): Promise<Booking[]>;
  markPayoutAsPaid(bookingIds: string[]): Promise<void>;
  updateRefundStatus(bookingId: string, status: string): Promise<void>;
  hasActiveBookingsForDoctor(doctorId: string): Promise<boolean>;
  findBookingByIdAndUser(bookingId: string, userId: string): Promise< Booking | null>;
  findBookingByIdAndDoctor(bookingId: string, doctorId: string): Promise< EnrichedBooking | null >;
  getDoctorsWithPendingEarnings(page: number, limit: number): Promise<{
    doctors: { doctorId: string; doctorName: string; totalPendingEarnings: number }[];
    totalPages: number;
  }>;

}

