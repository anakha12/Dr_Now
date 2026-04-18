export interface Booking {
  id: string; 
  patientName?: string;
  doctorName?: string;
  date?: string;
  doctorId: string; 
  slot?: {
    from: string;
    to: string;
  };
  department?: string;
  status?: string;
  totalAmount?: number;
  amount?: number;
  fee?: number;
  doctorEarning?: number;      
  commissionAmount?: number;   
  payoutStatus?: string;       
  paymentStatus?: string;
  cancellationReason?: string;  
  canCancel?: boolean;
  time: string;
  isReviewed?: boolean;
  prescription?: Prescription;
}
export type Prescription = {
  doctorName: string;
  date: string;
  medicines: {
    name: string;
    dose: string;
    frequency: string;
    duration: string;
    notes?: string;
  }[];
  notes?: string;
   registrationNumber?: string;
};