import { Role } from "../../../../utils/Constance";
export class DoctorResponseDTO {
  id!: string;
  name!: string;
  email!: string;
  phone!: string;
  yearsOfExperience!: number;
  specialization!: string;
  profileImage!: string;
  gender!: string;
  consultFee!: string;
  isBlocked!: boolean;
  isVerified!: boolean;
  role!: Role.DOCTOR;
  age!: string;
}