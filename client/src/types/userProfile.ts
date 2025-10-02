export interface UserProfile {
  id?: string;  // optional for form
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other" | "";
  bloodGroup?: string;
  address?: string;
  age?: number;
  image?: string;
}
