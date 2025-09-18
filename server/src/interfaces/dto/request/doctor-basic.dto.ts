
import { IsString } from "class-validator";

export class GetDoctorBasicsDTO {
  @IsString()
  doctorId!: string;
}
