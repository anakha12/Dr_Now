import { Expose } from "class-transformer";

export class DoctorListResponseDTO {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  specialization!: string;

  @Expose()
  consultFee!: number;

  @Expose()
  profileImage!: string;

  @Expose()
  yearsOfExperience!: number;
}
