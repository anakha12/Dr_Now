import { Availability } from "../../domain/entities/doctorEntity"; 

export class DoctorRegisterDTO {
  name: string;
  email: string;
  phone: string;
  yearsOfExperience: number;
  specialization: string;
  password: string;
  profileImage: string;
  medicalLicense: string;
  idProof: string;
  gender: string; 
  consultFee: string;
  availability:  Availability[];
  

  constructor(data: any) {
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.yearsOfExperience = data.yearsOfExperience;
    this.specialization = data.specialisation || data.specialization;
    this.password = data.password;
    this.profileImage = data.profileImage;
    this.medicalLicense = data.medicalLicense;
    this.idProof = data.idProof;
    this.gender = data.gender;
    this.consultFee = data.consultFee;
    this.availability = data.availability ?? [];
  }
}
