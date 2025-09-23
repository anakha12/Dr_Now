export interface Booking {
  id: string; 
  patientName?: string;
  doctorName?: string;
  date?: string;
  time?: string;
  slot?: string;
  department?: string;
  status?: string;
  amount?: number;
  fee?: number;
  canCancel?: boolean;
}
