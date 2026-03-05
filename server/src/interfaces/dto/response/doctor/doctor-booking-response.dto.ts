import { Expose, Type } from "class-transformer";

class MedicineDTO {
  @Expose()


  @Expose()
  name!: string;

  @Expose()
  dose!: string;

  @Expose()
  frequency!: string;

  @Expose()
  duration!: string;

  @Expose()
  notes!: string;
}

export class SlotDTO {
  @Expose()
  from!: string;

  @Expose()
  to!: string;
}

export class PrescriptionDTO {
  @Expose()
  doctorName!: string;

  @Expose()
  date!: string;

  @Expose()
  @Type(() => MedicineDTO)
  medicines!: MedicineDTO[];  

  @Expose()
  notes!: string;

  @Expose()
  _id!: string; 
}

export class DoctorBookingListResponseDTO {
  @Expose()
  id!: string;

  @Expose()
  date!: string;

  @Expose()
  status!: string;

  @Expose()
  patientName!: string;

  @Expose()
  department!: string; 

  @Expose()
  @Type(() => SlotDTO)
  slot!: SlotDTO;

  @Expose()
  @Type(() => PrescriptionDTO)
  prescription?: PrescriptionDTO | null;
}