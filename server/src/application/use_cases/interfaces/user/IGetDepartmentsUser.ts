export interface IGetDepartmentsUser {
  execute(page: number, limit: number): Promise<any[]>;
}
