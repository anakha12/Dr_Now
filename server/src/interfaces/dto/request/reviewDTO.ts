import { IsNotEmpty, IsNumber, IsString, Min, Max } from "class-validator";

export class CreateReviewDTO {
  @IsNotEmpty()
  @IsString()
  bookingId!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsNotEmpty()
  @IsString()
  comment!: string;
}
