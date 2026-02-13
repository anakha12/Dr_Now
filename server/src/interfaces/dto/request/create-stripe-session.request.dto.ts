import { IsNumber, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class SlotDTO {
  @IsString()
  from!: string;

  @IsString()
  to!: string;
}

export class CreateStripeSessionRequestDTO {
  @IsString()
  doctorId!: string;

  @IsString()
  userId!: string;

  @ValidateNested()
  @Type(() => SlotDTO)
  slot!: SlotDTO;

  @IsNumber()
  @Type(() => Number) 
  fee!: number;

  @IsString()
  date!: string;
}
