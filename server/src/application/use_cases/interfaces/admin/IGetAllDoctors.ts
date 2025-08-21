import { DoctorEntity } from "../../../../domain/entities/doctorEntity";

export interface IGetAllDoctorsUseCase {
  execute(
    page: number,
    limit: number,
    search: string
  ): Promise<{ doctors: DoctorEntity[]; totalDoctors: number }>;
}
