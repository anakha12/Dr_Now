// application/dto/slot.dto.ts
import { IsString, IsBoolean } from "class-validator";

export class SlotDto {
  @IsString()
  from!: string;

  @IsString()
  to!: string;

  @IsBoolean()
  booked!: boolean;

  constructor(from: string, to: string, booked: boolean) {
    this.from = from;
    this.to = to;
    this.booked = booked;
  }
}
