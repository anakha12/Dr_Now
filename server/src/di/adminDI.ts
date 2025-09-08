import { AdminController } from "../interfaces/controllers/adminController";
import { AuthController } from "../interfaces/controllers/authController";
import { JwtService } from "../services/JwtService";
import { ITokenService } from "../interfaces/tokenServiceInterface";

import { UserRepositoryImpl } from "../infrastructure/database/repositories/userRepositoryImpl";
import { DoctorRepositoryImpl } from "../infrastructure/database/repositories/doctorRepositoryImpl";
import { DepartmentRepositoryImpl } from "../infrastructure/database/repositories/departmentRepositoryImpl";
import { BookingRepositoryImpl } from "../infrastructure/database/repositories/bookingRepositoryImpl";
import { AdminWalletRepositoryImpl } from "../infrastructure/database/repositories/adminWalletRepositoryImpl";

import { LoginAdmin } from "../application/use_cases/admin/loginAdmin";
import { GetUnverifiedDoctors } from "../application/use_cases/admin/getUnverifiedDoctors";
import { VerifyDoctor } from "../application/use_cases/admin/verifyDoctor";
import { RejectDoctor } from "../application/use_cases/admin/rejectDoctor";
import { GetAllDoctors } from "../application/use_cases/admin/getAllDoctors";
import { ToggleBlockDoctor } from "../application/use_cases/admin/toggleBlockDoctor";
import { GetAllUsersUseCase } from "../application/use_cases/admin/getAllUsers";
import { ToggleUserBlockStatusUseCase } from "../application/use_cases/admin/toggleUserBlockStatus";
import { CreateDepartmentUseCase } from "../application/use_cases/admin/createDepartment";
import { GetDepartmentsUseCase } from "../application/use_cases/admin/getDepartments";
import { ToggleDepartmentStatusUseCase } from "../application/use_cases/admin/toggleDepartmentStatus";
import { GetPendingDoctorPayouts } from "../application/use_cases/admin/getPendingDoctorPayouts";
import { GetWalletSummary } from "../application/use_cases/admin/getWalletSummary";
import { PayoutDoctorUseCase } from "../application/use_cases/admin/payoutDoctor";

// --- Repositories ---
const userRepository = new UserRepositoryImpl();
const doctorRepository = new DoctorRepositoryImpl();
const departmentRepository = new DepartmentRepositoryImpl();
const bookingRepository = new BookingRepositoryImpl();
const adminWalletRepository = new AdminWalletRepositoryImpl();

// --- Lazy JWT Service ---
let jwtService: ITokenService | null = null;
export const getJwtService = ():  ITokenService => {
  if (!jwtService) {
    jwtService = new JwtService(); 
  }
  return jwtService;
};

// --- Lazy Controllers Factory ---
export const createAdminController = () => {
  const loginAdmin = new LoginAdmin(userRepository, getJwtService());
  const getUnverifiedDoctors = new GetUnverifiedDoctors(doctorRepository);
  const verifyDoctor = new VerifyDoctor(doctorRepository);
  const rejectDoctor = new RejectDoctor(doctorRepository);
  const getAllDoctors = new GetAllDoctors(doctorRepository);
  const toggleBlockDoctor = new ToggleBlockDoctor(doctorRepository);
  const getAllUsers = new GetAllUsersUseCase(userRepository);
  const toggleUserBlockStatus = new ToggleUserBlockStatusUseCase(userRepository);
  const createDepartment = new CreateDepartmentUseCase(departmentRepository);
  const getDepartments = new GetDepartmentsUseCase(departmentRepository);
  const toggleDepartmentStatus = new ToggleDepartmentStatusUseCase(departmentRepository);
  const getPendingDoctorPayouts = new GetPendingDoctorPayouts(bookingRepository);
  const getWalletSummary = new GetWalletSummary(adminWalletRepository, bookingRepository);
  const payoutDoctor = new PayoutDoctorUseCase(bookingRepository, doctorRepository, adminWalletRepository);

  return new AdminController(
    loginAdmin,
    getUnverifiedDoctors,
    verifyDoctor,
    rejectDoctor,
    getAllDoctors,
    toggleBlockDoctor,
    getAllUsers,
    toggleUserBlockStatus,
    createDepartment,
    getDepartments,
    toggleDepartmentStatus,
    getPendingDoctorPayouts,
    getWalletSummary,
    payoutDoctor
  );
};

export const createAuthController = () => new AuthController(getJwtService(), "refreshToken");
