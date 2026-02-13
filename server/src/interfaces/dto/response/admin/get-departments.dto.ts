import { DepartmentResponseDTO } from "./department-response.dto";
export class GetDepartmentsResponseDTO {
  departments!: DepartmentResponseDTO[];
  totalPages!: number;
}