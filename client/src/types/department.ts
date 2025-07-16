export interface DepartmentResponse {
  departments: Department[];
  totalPages: number;
}


 export interface Department {
  id: string;
  Departmentname: string;
  Description: string;
  status: "Listed" | "Unlisted";
  createdAt: string;
}