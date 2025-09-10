import { DoctorController } from "../interfaces/controllers/doctorController";

import { UserRepositoryImpl } from "../infrastructure/database/repositories/userRepositoryImpl";
import { DoctorRepositoryImpl } from "../infrastructure/database/repositories/doctorRepositoryImpl";
import { DepartmentRepositoryImpl } from "../infrastructure/database/repositories/departmentRepositoryImpl";
import { BookingRepositoryImpl } from "../infrastructure/database/repositories/bookingRepositoryImpl";
import { AdminWalletRepositoryImpl } from "../infrastructure/database/repositories/adminWalletRepositoryImpl";


import { SendDoctorOtp } from "../application/use_cases/doctor/sendDoctorOtp";
import { VerifyDoctorOtp } from "../application/use_cases/doctor/verifyOtp";
import { DoctorLogin } from "../application/use_cases/doctor/doctorLogin";
import { GetDoctorProfile } from "../application/use_cases/doctor/getDoctorProfile";
import { UpdateDoctorProfile } from "../application/use_cases/doctor/updateDoctorProfile";
import { AddDoctorAvailability } from "../application/use_cases/doctor/addDoctorAvailability";
import { GetDoctorAvailability } from "../application/use_cases/doctor/getDoctorAvailability";
import { GetDoctorBookings } from "../application/use_cases/doctor/getDoctorBookings"; 
import { EditDoctorAvailability } from "../application/use_cases/doctor/editDoctorAvailability";
import { RemoveDoctorSlot } from "../application/use_cases/doctor/removeDoctorSlot";
import { CancelDoctorBooking } from "../application/use_cases/doctor/cancelDoctorBooking";
import { GetAllDepartments } from "../application/use_cases/doctor/getAllDepartments";
import { GetDoctorWalletSummary } from "../application/use_cases/doctor/getDoctorWalletSummary";
import { CompleteDoctorProfile } from "../application/use_cases/doctor/completeDoctorProfile";
import { GetBookingDetailsDoctor } from "../application/use_cases/doctor/getBookingDetailsDoctor";
import { ITokenService } from "../interfaces/tokenServiceInterface";
import { JwtService } from "../services/JwtService";
import { AuthController } from "../interfaces/controllers/authController";


const userRepository = new UserRepositoryImpl();
const  doctorRepository = new DoctorRepositoryImpl();
const  departmentRepository = new DepartmentRepositoryImpl();
const  bookingRepository = new BookingRepositoryImpl();
const  adminWalletRepository = new AdminWalletRepositoryImpl();

const jwtService:ITokenService = new JwtService()


const sendDoctorOtp= new SendDoctorOtp( doctorRepository);
const verifyOtp = new VerifyDoctorOtp(doctorRepository);
const doctorLogin = new DoctorLogin(doctorRepository, jwtService);
const getDoctorProfile = new GetDoctorProfile(doctorRepository);
const updateDoctorProfile = new UpdateDoctorProfile(doctorRepository, bookingRepository);
const addDoctorAvailability = new AddDoctorAvailability(doctorRepository);
const getDoctorAvailability = new GetDoctorAvailability(doctorRepository);
const getDoctorBookings = new GetDoctorBookings(bookingRepository);
const editDoctorAvailability = new EditDoctorAvailability(doctorRepository);
const removeDoctorSlot = new RemoveDoctorSlot(doctorRepository);
const cancelDoctorBooking = new CancelDoctorBooking(bookingRepository,userRepository,adminWalletRepository);
const getAllDepartments = new GetAllDepartments(departmentRepository);
const getDoctorWalletSummary = new GetDoctorWalletSummary(doctorRepository);
const completeDoctorProfile = new CompleteDoctorProfile(doctorRepository);
const getBookingDetailsDoctor = new GetBookingDetailsDoctor(bookingRepository)

export const doctorController = new DoctorController(
  sendDoctorOtp,
  verifyOtp,
  doctorLogin,
  getDoctorProfile,
  updateDoctorProfile,
  addDoctorAvailability,
  getDoctorAvailability,
  getDoctorBookings,
  editDoctorAvailability,
  removeDoctorSlot,
  cancelDoctorBooking,
  getAllDepartments,
  getDoctorWalletSummary,
  completeDoctorProfile,
  getBookingDetailsDoctor
);


export const doctorAuthController = new AuthController(jwtService,'refreshToken')