import { CreateStripeSessionRequestDTO } from "../../../../interfaces/dto/request/create-stripe-session.request.dto";
import { CreateStripeSessionResponseDTO } from "../../../../interfaces/dto/response/user/create-stripe-session.response.dto";

export interface ICreateStripeSession {
  execute(
    data: CreateStripeSessionRequestDTO
  ): Promise<CreateStripeSessionResponseDTO>;
}
