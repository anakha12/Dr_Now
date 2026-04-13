import { Review } from "../../../domain/entities/reviewEntity";
import { IReviewRepository } from "../../../domain/repositories/reviewRepository";
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { CreateReviewDTO } from "../../../interfaces/dto/request/reviewDTO";
import { BaseUseCase } from "../base-usecase";

export class CreateReviewUseCase extends BaseUseCase<CreateReviewDTO, Review> {
  constructor(
    private reviewRepository: IReviewRepository,
    private bookingRepository: IBookingRepository
  ) {
    super();
  }

  async execute(dto: CreateReviewDTO): Promise<Review> {
    // 1. Validate DTO
    const validatedDto = await this.validateDto(CreateReviewDTO, dto);

    // 2. Fetch booking to verify existence and user ownership
    const booking = await this.bookingRepository.findBookingById(validatedDto.bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // 3. Verify booking is completed
    if (booking.status !== 'Completed') {
      throw new Error("Only completed consultations can be reviewed");
    }

    // 4. Verify if already reviewed
    const existingReview = await this.reviewRepository.findByBookingId(validatedDto.bookingId);
    if (existingReview) {
      throw new Error("You have already reviewed this consultation");
    }

    // 5. Create Review Entity
    const review = new Review(
      booking.doctorId,
      booking.userId,
      validatedDto.bookingId,
      validatedDto.rating,
      validatedDto.comment
    );

    // 6. Save to repository
    const savedReview = await this.reviewRepository.create(review);

    // 7. Mark booking as reviewed
    await this.bookingRepository.updateIsReviewed(validatedDto.bookingId, true);

    return savedReview;
  }
}
