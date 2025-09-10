import { Exclude, Expose } from "class-transformer";

@Exclude()
export class DoctorLoginResponseDTO {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  role!: string;
}
