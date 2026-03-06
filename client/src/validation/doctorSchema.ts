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

export const doctorProfileSchema = z.object({
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
  education: z.array(
    z.object({
      degree: z.string().min(2, { message: "Degree is required" }),
      institution: z.string().min(2, { message: "Institution is required" }),
      year: z.string().regex(/^\d{4}$/, { message: "Year must be 4 digits" }),
    })
  ).min(1, { message: "At least one education entry is required" }),
  awards: z.array(z.string().min(2, { message: "Award must be at least 2 characters" })),
  experience: z.array(
    z.object({
      hospital: z.string().min(2, { message: "Hospital is required" }),
      role: z.string().min(2, { message: "Role is required" }),
      years: z.string().min(1, { message: "Years is required" }),
    })
  ).min(1, { message: "At least one experience entry is required" }),
  affiliatedHospitals: z.array(z.string().min(2, { message: "Hospital name must be at least 2 characters" })).min(1, { message: "At least one affiliated hospital is required" }),
});