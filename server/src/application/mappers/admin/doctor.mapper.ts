import { DoctorResponseDTO } from "../../../interfaces/dto/response/admin/get-all-doctor.dto";
import { DoctorEntity } from "../../../domain/entities/doctorEntity"; 

export class DoctorMapper {

  static toResponseDTO(doctors: DoctorEntity[]): DoctorResponseDTO[] {
    return doctors.map((doc) => ({
      id: doc.id ?? "",
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      yearsOfExperience: doc.yearsOfExperience,
      specialization: doc.specialization,
      profileImage: doc.profileImage,
      gender: doc.gender,
      consultFee: doc.consultFee,
      isBlocked: doc.isBlocked,
      isVerified: doc.isVerified,
      role: doc.role,
      age: doc.age,
    }));
  }
}