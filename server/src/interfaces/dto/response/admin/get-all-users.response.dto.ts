export class UserListItemDTO {
  id!: string;
  name!: string;
  email!: string;
  age!: string;
  gender!: string;
  phone!: string;
  isBlocked!: boolean;


  image?: string;
  profileCompletion?: boolean;
  dateOfBirth?: Date;
  bloodGroup?: string;
  address?: string;
  isVerified?: boolean;
  role?: string;
  walletBalance?: number;
}


export class GetAllUsersResponseDTO {
  users!: UserListItemDTO[];
  totalPages!: number;
  currentPage!: number;
}
