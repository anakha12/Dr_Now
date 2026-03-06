import { z } from "zod";

/* ---------------- MEDICINE SCHEMA ---------------- */
export const medicineSchema = z.object({
  name: z.string().min(1, "Medicine name is required"),
  dose: z.string().min(1, "Dose is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
  notes: z.string().optional(),
});

/* ---------------- PRESCRIPTION SCHEMA ---------------- */
export const prescriptionSchema = z.object({
  doctorName: z.string().min(1, "Doctor name is required"),
  medicines: z
    .array(medicineSchema)
    .min(1, "At least one medicine must be added"),
  notes: z.string().optional(),
});