export interface Booking {
  id: string; 
  patientName?: string;
  doctorName?: string;
  date?: string;
  slot?: {
    from: string;
    to: string;
  };
  department?: string;
  status?: string;
  amount?: number;
  fee?: number;
  canCancel?: boolean;
}
