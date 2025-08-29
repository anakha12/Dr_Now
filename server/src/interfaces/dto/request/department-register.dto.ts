import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class DepartmentRegisterDTO {
  @IsString({ message: 'Department name must be a string' })
  @IsNotEmpty({ message: 'Department name is required' })
  @MaxLength(50, { message: 'Department name must not exceed 50 characters' })
  Departmentname!: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @MaxLength(200, { message: 'Description must not exceed 200 characters' })
  Description!: string;
}
