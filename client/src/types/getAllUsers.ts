export interface GetAllUsersQueryParams {
  page: number;
  limit: number;
  search?: string;
  gender?: string;
  status?: string;
  minAge?: number;
  maxAge?: number;
  sort?: string;
}