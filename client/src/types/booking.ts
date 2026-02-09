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
  totalAmount?: number;
  amount?: number;
  fee?: number;
  doctorEarning?: number;      
  commissionAmount?: number;   
  payoutStatus?: string;       
  cancellationReason?: string;  
  canCancel?: boolean;
  time: string;
}
