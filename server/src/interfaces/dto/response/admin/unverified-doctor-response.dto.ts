import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UnverifiedDoctorResponseDTO {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  phone!: string;

  @Expose()
  specialization!: string;

  @Expose()
  createdAt!: Date;
}
export class GetUnverifiedDoctorsResponseDTO {
  doctors!: UnverifiedDoctorResponseDTO[];
  total!: number;
}

