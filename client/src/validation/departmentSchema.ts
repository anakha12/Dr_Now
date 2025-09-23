import { z } from "zod";


export const addDepartmentSchema = z.object({
  Departmentname: z
    .string()
    .min(2, { message: "Department name is required" }),
  Description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters" })
    .max(200, { message: "Description cannot exceed 200 characters" }),
});
