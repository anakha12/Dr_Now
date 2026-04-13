import mongoose from "mongoose";
import { Review } from "../../domain/entities/reviewEntity";
import { IReviewRepository } from "../../domain/repositories/reviewRepository";
import ReviewModel, { IReview } from "../database/models/review.model";

export class ReviewRepositoryImpl implements IReviewRepository {
  async create(review: Review): Promise<Review> {
    const newReview = await ReviewModel.create({
      doctorId: review.doctorId,
      userId: review.userId,
      bookingId: review.bookingId,
      rating: review.rating,
      comment: review.comment,
    });
    return this.mapToEntity(newReview);
  }

  async findByDoctorId(doctorId: string): Promise<Review[]> {
    const reviews = await ReviewModel.find({ doctorId })
      .sort({ createdAt: -1 })
      .exec();
    return reviews.map(this.mapToEntity);
  }

  async findByBookingId(bookingId: string): Promise<Review | null> {
    const review = await ReviewModel.findOne({ bookingId }).exec();
    return review ? this.mapToEntity(review) : null;
  }

  async getAverageRating(doctorId: string): Promise<{ averageRating: number; reviewCount: number }> {
    const result = await ReviewModel.aggregate([
      { $match: { doctorId: new mongoose.Types.ObjectId(doctorId) } },
      {
        $group: {
          _id: "$doctorId",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return { averageRating: 0, reviewCount: 0 };
    }

    return {
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      reviewCount: result[0].reviewCount,
    };
  }

  private mapToEntity(doc: IReview): Review {
    return new Review(
      doc.doctorId.toString(),
      doc.userId.toString(),
      doc.bookingId.toString(),
      doc.rating,
      doc.comment,
      doc._id.toString(),
      doc.createdAt
    );
  }
}
