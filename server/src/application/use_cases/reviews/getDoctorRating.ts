import { IReviewRepository } from "../../../domain/repositories/reviewRepository";

export class GetDoctorRatingUseCase {
  constructor(private reviewRepository: IReviewRepository) {}

  async execute(doctorId: string): Promise<{ averageRating: number; reviewCount: number }> {
    if (!doctorId) {
      throw new Error("Doctor ID is required");
    }
    return await this.reviewRepository.getAverageRating(doctorId);
  }
}
