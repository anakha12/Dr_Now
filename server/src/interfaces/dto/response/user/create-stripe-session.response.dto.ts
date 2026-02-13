import { Expose, Exclude } from "class-transformer";

@Exclude()
export class CreateStripeSessionResponseDTO {
  @Expose()
  sessionId!: string;

  @Expose()
  publishableKey!: string;
}
