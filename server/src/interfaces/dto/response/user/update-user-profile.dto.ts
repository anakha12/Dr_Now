
export class UpdateUserProfileResponseDTO {
  id!: string;
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  image?: string;
  age?: number;
  profileCompletion!: boolean;
}
