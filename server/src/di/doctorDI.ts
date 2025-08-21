import { DoctorController } from "../interfaces/controllers/doctorController";

import { UserRepositoryImpl } from "../infrastructure/database/repositories/userRepositoryImpl";
import { DoctorRepositoryImpl } from "../infrastructure/database/repositories/doctorRepositoryImpl";
import { DepartmentRepositoryImpl } from "../infrastructure/database/repositories/departmentRepositoryImpl";
import { BookingRepositoryImpl } from "../infrastructure/database/repositories/bookingRepositoryImpl";
import { AdminWalletRepositoryImpl } from "../infrastructure/database/repositories/adminWalletRepositoryImpl";

export const doctorController = new DoctorController({
  userRepository: new UserRepositoryImpl(),
  doctorRepository: new DoctorRepositoryImpl(),
  departmentRepository: new DepartmentRepositoryImpl(),
  bookingRepository: new BookingRepositoryImpl(),
  adminWalletRepository: new AdminWalletRepositoryImpl(),
});
