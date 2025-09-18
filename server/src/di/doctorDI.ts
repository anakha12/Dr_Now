import { DoctorController } from "../interfaces/controllers/doctorController";

import { UserRepositoryImpl } from "../infrastructure/database/repositories/userRepositoryImpl";
import { DoctorRepositoryImpl } from "../infrastructure/database/repositories/doctorRepositoryImpl";
import { DepartmentRepositoryImpl } from "../infrastructure/database/repositories/departmentRepositoryImpl";
import { BookingRepositoryImpl } from "../infrastructure/database/repositories/bookingRepositoryImpl";
import { AdminWalletRepositoryImpl } from "../infrastructure/database/repositories/adminWalletRepositoryImpl";
import { DoctorAvailabilityExceptionRepositoryImpl } from "../infrastructure/database/repositories/doctorAvailabilityExceptionRepositoryImpl";


import { SendDoctorOtp } from "../application/use_cases/doctor/sendDoctorOtp";
import { VerifyDoctorOtp } from "../application/use_cases/doctor/verifyOtp";
import { DoctorLogin } from "../application/use_cases/doctor/doctorLogin";
import { GetDoctorProfile } from "../application/use_cases/doctor/getDoctorProfile";
import { UpdateDoctorProfile } from "../application/use_cases/doctor/updateDoctorProfile";
import { AddDoctorAvailabilityRuleUseCase } from "../application/use_cases/doctor/addDoctorAvailability";
import { GetDoctorAvailability } from "../application/use_cases/doctor/getDoctorAvailability";
import { GetDoctorBookings } from "../application/use_cases/doctor/getDoctorBookings"; 
import { RemoveDoctorSlot } from "../application/use_cases/doctor/removeDoctorSlot";
import { CancelDoctorBooking } from "../application/use_cases/doctor/cancelDoctorBooking";
import { GetAllDepartments } from "../application/use_cases/doctor/getAllDepartments";
import { GetDoctorWalletSummary } from "../application/use_cases/doctor/getDoctorWalletSummary";
import { CompleteDoctorProfile } from "../application/use_cases/doctor/completeDoctorProfile";
import { GetBookingDetailsDoctor } from "../application/use_cases/doctor/getBookingDetailsDoctor";
import { AddDoctorAvailabilityExceptionUseCase } from "../application/use_cases/doctor/addDoctorAvailabilityException";
import { ITokenService } from "../interfaces/tokenServiceInterface";
import { JwtService } from "../services/JwtService";
import { AuthController } from "../interfaces/controllers/authController";
import { AvailabilityRuleRepositoryImpl } from "../infrastructure/database/repositories/availabilityRuleRepositoryImpl";
import { GetDoctorAvailabilityExceptionsUseCase } from "../application/use_cases/doctor/getDoctorAvailabilityExceptions";
import { DeleteDoctorAvailabilityExceptionUseCase } from "../application/use_cases/doctor/deleteDoctorAvailabilityException";
import { EditDoctorAvailabilityRuleUseCase } from "../application/use_cases/doctor/editAvailabilityRule";
import { DeleteDoctorAvailabilityRuleUseCase } from "../application/use_cases/doctor/deleteDoctorAvailabilityRule";


const userRepository = new UserRepositoryImpl();
const  doctorRepository = new DoctorRepositoryImpl();
const  departmentRepository = new DepartmentRepositoryImpl();
const  bookingRepository = new BookingRepositoryImpl();
const  adminWalletRepository = new AdminWalletRepositoryImpl();
const availabilityRuleRepository = new AvailabilityRuleRepositoryImpl();
const doctorAvailabilityExceptionRepository = new DoctorAvailabilityExceptionRepositoryImpl();


const jwtService:ITokenService = new JwtService()


const sendDoctorOtp= new SendDoctorOtp( doctorRepository);
const verifyOtp = new VerifyDoctorOtp(doctorRepository);
const doctorLogin = new DoctorLogin(doctorRepository, jwtService);
const getDoctorProfile = new GetDoctorProfile(doctorRepository);
const updateDoctorProfile = new UpdateDoctorProfile(doctorRepository, bookingRepository);
const addDoctorAvailabilityRule = new AddDoctorAvailabilityRuleUseCase(availabilityRuleRepository);
const getDoctorAvailability = new GetDoctorAvailability(availabilityRuleRepository);
const getDoctorBookings = new GetDoctorBookings(bookingRepository);
const removeDoctorSlot = new RemoveDoctorSlot(doctorRepository);
const cancelDoctorBooking = new CancelDoctorBooking(bookingRepository,userRepository,adminWalletRepository);
const getAllDepartments = new GetAllDepartments(departmentRepository);
const getDoctorWalletSummary = new GetDoctorWalletSummary(doctorRepository);
const completeDoctorProfile = new CompleteDoctorProfile(doctorRepository);
const getBookingDetailsDoctor = new GetBookingDetailsDoctor(bookingRepository);
const addDoctorAvailabilityException = new AddDoctorAvailabilityExceptionUseCase(doctorAvailabilityExceptionRepository);
const getDoctorAvailabilityExceptions = new GetDoctorAvailabilityExceptionsUseCase( doctorAvailabilityExceptionRepository)
const deleteAvailabilityException = new DeleteDoctorAvailabilityExceptionUseCase(doctorAvailabilityExceptionRepository );
const editAvailabilityRuleUseCase = new EditDoctorAvailabilityRuleUseCase(availabilityRuleRepository)
const deleteAvailabilityRule = new DeleteDoctorAvailabilityRuleUseCase(availabilityRuleRepository);
const getDoctorAvailabilityExceptionsUseCase = new GetDoctorAvailabilityExceptionsUseCase(doctorAvailabilityExceptionRepository);


export const doctorController = new DoctorController(
  sendDoctorOtp,
  verifyOtp,
  doctorLogin,
  getDoctorProfile,
  updateDoctorProfile,
  addDoctorAvailabilityRule,
  getDoctorAvailability,
  getDoctorBookings,
  removeDoctorSlot,
  cancelDoctorBooking,
  getAllDepartments,
  getDoctorWalletSummary,
  completeDoctorProfile,
  getBookingDetailsDoctor,
  addDoctorAvailabilityException,
  getDoctorAvailabilityExceptions,
  deleteAvailabilityException,
  editAvailabilityRuleUseCase,
  deleteAvailabilityRule,
  
);


export const doctorAuthController = new AuthController(jwtService,'refreshToken')