import { ReviewRepositoryImpl } from "../infrastructure/repositories/reviewRepositoryImpl";
import { BookingRepositoryImpl } from "../infrastructure/database/repositories/bookingRepositoryImpl";
import { CreateReviewUseCase } from "../application/use_cases/reviews/createReview";
import { GetDoctorReviewsUseCase } from "../application/use_cases/reviews/getDoctorReviews";
import { GetDoctorRatingUseCase } from "../application/use_cases/reviews/getDoctorRating";
import { ReviewController } from "../interfaces/controllers/ReviewController";

const reviewRepository = new ReviewRepositoryImpl();
const bookingRepository = new BookingRepositoryImpl();

const createReviewUseCase = new CreateReviewUseCase(reviewRepository, bookingRepository);
const getDoctorReviewsUseCase = new GetDoctorReviewsUseCase(reviewRepository);
const getDoctorRatingUseCase = new GetDoctorRatingUseCase(reviewRepository);

export const reviewController = new ReviewController(
  createReviewUseCase,
  getDoctorReviewsUseCase,
  getDoctorRatingUseCase
);
