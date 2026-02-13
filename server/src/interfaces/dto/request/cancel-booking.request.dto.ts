

import { IsString, IsNotEmpty } from "class-validator";
import { Transform } from "class-transformer";

export class CancelBookingRequestDTO {

  @IsString()
  @IsNotEmpty()
  bookingId!: string;

  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  reason!: string;
}
