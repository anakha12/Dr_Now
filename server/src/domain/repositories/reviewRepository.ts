import { Review } from "../entities/reviewEntity";

export interface IReviewRepository {
  create(review: Review): Promise<Review>;
  findByDoctorId(doctorId: string): Promise<Review[]>;
  findByBookingId(bookingId: string): Promise<Review | null>;
  getAverageRating(doctorId: string): Promise<{ averageRating: number; reviewCount: number }>;
}
