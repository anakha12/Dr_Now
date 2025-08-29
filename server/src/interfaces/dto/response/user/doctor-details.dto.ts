import { Exclude, Expose } from "class-transformer";

@Exclude()
export class DoctorDetailsResponseDTO {
  @Expose()
  id!: string; 

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  phone!: string;

  @Expose()
  yearsOfExperience!: number;

  @Expose()
  specialization!: string;

  @Expose()
  profileImage?: string;

  @Expose()
  bio?: string;

  @Expose()
  consultFee?: number;

  @Expose()
  affiliatedHospitals?: string[];

  @Expose()
  awards?: string[];

  @Expose()
  education?: string[];

  @Expose()
  experience?: string[];
}
