

export class DepartmentRegisterDTO {
  Departmentname: string;
  status?: 'Listed' | 'Unlisted';
  Description: string;

  constructor(data: any) {
    this.Departmentname = data.Departmentname;
    this.status = data.status ?? 'Listed';
    this.Description = data.Description;
  }
}
