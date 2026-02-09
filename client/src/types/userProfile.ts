export interface UserProfile {
  id: string;  
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other" | "";
  bloodGroup?: string;
  address?: string;
  age?: number;
  image?: string;
  
  profileCompletion?: boolean;
}

export interface AdminUser extends UserProfile {
  isBlocked?: boolean;
  walletBalance?: number;
}
