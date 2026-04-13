import { Review } from "../../../domain/entities/reviewEntity";
import { IReviewRepository } from "../../../domain/repositories/reviewRepository";

export class GetDoctorReviewsUseCase {
  constructor(private reviewRepository: IReviewRepository) {}

  async execute(doctorId: string): Promise<Review[]> {
    if (!doctorId) {
      throw new Error("Doctor ID is required");
    }
    return await this.reviewRepository.findByDoctorId(doctorId);
  }
}
