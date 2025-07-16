import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class DoctorLogin {
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(email: string, password: string): Promise<
    | { token: string; name: string }
    | { notVerified: true; name: string; email: string }
    | { isRejected: true; name: string; email: string }
  > {
    const doctor = await this._doctorRepo.findByEmail(email);
    if (!doctor) throw new Error("Doctor not found");
   
    if(String(doctor.isRejected) === 'true'){
      return{
        isRejected: true,
        name: doctor.name,
        email: doctor.email,

      }
    }

    if (!doctor.isVerified) {
    
      return {
        notVerified: true,
        name: doctor.name,
        email: doctor.email,
      };
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) throw new Error("Incorrect password");

    const token = jwt.sign(
      { userId: doctor.id, email: doctor.email, role: "doctor" },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return {
      token,
      name: doctor.name,
    };
  }
}

