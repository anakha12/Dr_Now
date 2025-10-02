
import { Exclude, Expose, Transform } from "class-transformer";

@Exclude()
export class FullUserProfileResponseDTO {
  @Expose()
  @Transform(({ obj }) => obj.id)
  userId!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  phone!: string;

  @Expose()
  dateOfBirth!: Date;

  @Expose()
  age!: string;

  @Expose()
  gender!: string;

  @Expose()
  bloodGroup!: string;

  @Expose()
  address!: string;

  @Expose()
  image!: string;
}
