export interface GetAllDoctorsQueryParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  specialization?: string;
  sort?: string;
}