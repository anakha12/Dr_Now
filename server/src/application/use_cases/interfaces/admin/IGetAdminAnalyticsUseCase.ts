import { AdminAnalyticsResponseDTO } from "../../../../interfaces/dto/response/admin/admin-analytics.dto";

export interface IGetAdminAnalyticsUseCase {
  execute(): Promise<AdminAnalyticsResponseDTO>;
}
