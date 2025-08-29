
import { Exclude, Expose, Transform } from "class-transformer";

@Exclude()
export class UserProfileResponseDTO {
  @Expose()
  @Transform(({ obj }) => obj.id)
  userId!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  phone!: string;

}
