import { plainToInstance } from "class-transformer";
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { AdminAnalyticsResponseDTO } from "../../../interfaces/dto/response/admin/admin-analytics.dto";
import { IGetAdminAnalyticsUseCase } from "../interfaces/admin/IGetAdminAnalyticsUseCase";

export class GetAdminAnalytics implements IGetAdminAnalyticsUseCase {
  constructor(private readonly _bookingRepo: IBookingRepository) {}

  async execute(): Promise<AdminAnalyticsResponseDTO> {
    const data = await this._bookingRepo.getAdminAnalytics();

    return plainToInstance(AdminAnalyticsResponseDTO, data, {
      excludeExtraneousValues: true,
    });
  }
}
