export class DoctorPendingPayoutDTO {
  id!: string;
  name!: string;
  email!: string;
  pendingEarnings!: number;
}

export class GetPendingDoctorPayoutsResponseDTO {
  doctors!: DoctorPendingPayoutDTO[];
  totalPages!: number;
}
