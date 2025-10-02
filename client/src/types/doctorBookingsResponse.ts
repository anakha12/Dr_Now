import type { Booking } from "./booking";

export interface DoctorBookingsResponse {
  bookings: Booking[];
  totalPages: number;
}