import { Booking } from "../entities/bookingEntity"; // already present
import { EnrichedBooking } from "../entities/bookingEntity";

export interface BookingRepository {
  createBooking(booking: Booking): Promise<Booking>;
  findById(bookingId: string): Promise<Booking | null>;
  findBookingBySlot(doctorId: string, date: string, slotFrom: string): Promise<Booking | null>;
  findUserBookings(userId: string): Promise<EnrichedBooking[]>;
  updatePaymentStatus(bookingId: string, status: 'paid' | 'failed', transactionId?: string): Promise<void>;
  getBookedSlotsByDoctorAndDate(doctorId: string,date: string): Promise<{ from: string; to: string }[]>;
  cancelBooking(bookingId: string): Promise<void>;
  getDoctorBookings(doctorId: string): Promise<Booking[]>;

}

