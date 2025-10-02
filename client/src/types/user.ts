export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isBlocked?: boolean;

  dateOfBirth?: string;  
  age?: string;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  image?: string;

  profileCompletion?: boolean;
}
