import { DoctorEntity } from "../../../../domain/entities/doctorEntity";

export interface IGetDoctorProfile {
  execute(id: string): Promise<DoctorEntity>;
}
