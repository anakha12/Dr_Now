import { Booking } from "../entities/booking.entity";

export interface IBookingRepository {
  createBooking(booking: Booking): Promise<Booking>;
  findBookingById(id: string): Promise<Booking | null>; 
  findBookingByIdAndUser(id: string, userId: string): Promise<Booking | null>;
  findBookingsByDoctorAndDate(doctorId: string, date: string): Promise<Booking[]>;
  updateBooking(booking: Booking): Promise<Booking>;
  isSlotAvailable(
    doctorId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean>;
  findUserBookings(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ bookings: Booking[]; total: number }>;

  getDoctorBookings(
    doctorId: string,
    page: number,
    limit: number
  ): Promise<{ bookings: Booking[]; totalPages: number }>;
  findBookingByIdAndDoctor(id: string, doctorId: string): Promise<Booking | null>;
  cancelBooking(bookingId: string, reason: string): Promise<Booking | null>;
  updateRefundStatus(bookingId: string, status: string): Promise<Booking | null>;
}
