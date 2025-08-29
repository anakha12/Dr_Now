import { Exclude, Expose } from "class-transformer";

@Exclude()
export class DepartmentResponseDTO {
  @Expose()
  id!: string;

  @Expose()
  Departmentname!: string;

  @Expose()
  Description!: string;
  
}
