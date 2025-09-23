import { z } from "zod";

export const doctorRegisterSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  age: z.number().min(18, { message: "Age must be at least 18" }),
  phone: z.string().regex(/^[0-9]{10}$/, { message: "Phone must be 10 digits" }),
  gender: z.enum(["Male", "Female", "Other"]),
  yearsOfExperience: z.number().min(0),
  consultFee: z.number().min(0),
  specialization: z.string().min(1),
});

export const doctorLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});