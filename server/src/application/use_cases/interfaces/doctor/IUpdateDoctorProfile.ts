// IUpdateDoctorProfile.ts
import { UpdateDoctorProfileDTO } from "../../../../interfaces/dto/request/update-doctorProfile.dto";

export interface IUpdateDoctorProfile {
  execute(dto: UpdateDoctorProfileDTO): Promise<
    { message: string } | { success: boolean; updatedDoctor: Record<string, unknown> }
  >;
}
