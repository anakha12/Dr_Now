import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UserLoginResponseDTO {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  role!: string;
}
