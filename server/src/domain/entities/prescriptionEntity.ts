
export interface Medicine {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface Prescription {
  doctorName: string;
  date: string;
  medicines: Medicine[];
  notes?: string;
}