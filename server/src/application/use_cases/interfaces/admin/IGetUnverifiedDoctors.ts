import { DoctorEntity } from "../../../../domain/entities/doctorEntity";

export interface IGetUnverifiedDoctors {
  execute(
    page: number,
    limit: number
  ): Promise<{
    doctors: DoctorEntity[];
    total: number;
  }>;
}
