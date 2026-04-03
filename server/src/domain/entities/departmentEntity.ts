

export interface DepartmentEntity {
  id?: string;
  Departmentname: string;
  status?: 'Listed' | 'Unlisted';
  Description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
