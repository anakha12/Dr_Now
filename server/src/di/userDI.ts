

import { UserController } from "../interfaces/controllers/userController";
import { stripe } from "../config/stripe"; 
import { UserRepositoryImpl } from "../infrastructure/database/repositories/userRepositoryImpl";
import { DoctorRepositoryImpl } from "../infrastructure/database/repositories/doctorRepositoryImpl";
import { DepartmentRepositoryImpl } from "../infrastructure/database/repositories/departmentRepositoryImpl";
import { BookingRepositoryImpl } from "../infrastructure/database/repositories/bookingRepositoryImpl";
import { AdminWalletRepositoryImpl } from "../infrastructure/database/repositories/adminWalletRepositoryImpl";
import { LoginUser } from "../application/use_cases/user/loginUser";
import { BookWithWalletUseCase } from "../application/use_cases/user/bookWithWallet";
import { RegisterUser } from "../application/use_cases/user/registerUser";
import { VerifyUserOtp } from "../application/use_cases/user/verifyUserOtp";
import { SendUserOtp } from "../application/use_cases/user/sendUserOtp";
import { LogoutUserUseCase } from "../application/use_cases/user/logoutUser"
import { GoogleLoginUser } from "../application/use_cases/user/googleLoginUser";
import { SendResetOtp } from "../application/use_cases/user/sendResetOtp";
import { ResetPassword } from "../application/use_cases/user/resetPassword";
import { GetAllDoctorsForUser } from "../application/use_cases/user/getAllDoctorsForUser";
import { GetDoctorById } from "../application/use_cases/user/getDoctorById";
import { CreateStripeSession } from "../application/use_cases/user/createStripeSession";
import { GetBookedSlots } from "../application/use_cases/user/getBookedSlots";
import { GetUserProfile } from "../application/use_cases/user/getUserProfile";
import { GetUserBookings } from "../application/use_cases/user/getUserBookings";
import { CancelUserBookingUseCase } from "../application/use_cases/user/cancelUserBooking";
import { GetBookingDetails } from "../application/use_cases/user/getBookingDetails";
import { GetDepartmentsUser } from "../application/use_cases/user/getDepartmentsUser";
import { GetUserWalletUseCase } from "../application/use_cases/user/getUserWallet";
import { GetFilteredDoctorsUseCase } from "../application/use_cases/user/getFilteredDoctors";
import { ITokenService } from "../interfaces/tokenServiceInterface";
import { JwtService } from "../services/JwtService";
import { AuthController } from "../interfaces/controllers/authController";


const userRepository = new UserRepositoryImpl();
const doctorRepository = new DoctorRepositoryImpl();
const departmentRepository = new DepartmentRepositoryImpl();
const bookingRepository = new BookingRepositoryImpl();
const adminWalletRepository = new AdminWalletRepositoryImpl();

const jwtService: ITokenService = new JwtService();


const loginUser = new LoginUser(userRepository, jwtService);
const bookWithWalletUseCase= new BookWithWalletUseCase(
                                  userRepository,
                                  doctorRepository,
                                  bookingRepository,
                                  adminWalletRepository
                                );

const registerUser = new RegisterUser(userRepository);
const verifyUserOtp = new VerifyUserOtp(userRepository);
const sendUserOtp = new SendUserOtp(userRepository, doctorRepository);
const logoutUser = new LogoutUserUseCase(userRepository);
const googleLoginUser = new GoogleLoginUser(userRepository);
const sendResetOtp = new SendResetOtp(userRepository);
const resetPassword = new ResetPassword(userRepository);
const getAllDoctorsForUser = new GetAllDoctorsForUser(doctorRepository);
const getDoctorById = new GetDoctorById(doctorRepository);
const createStripeSession = new CreateStripeSession(doctorRepository, stripe);
const getBookedSlots = new GetBookedSlots(bookingRepository);
const getUserProfile = new GetUserProfile(userRepository)
const getUserBookings = new GetUserBookings(bookingRepository);
const cancelBooking = new CancelUserBookingUseCase(bookingRepository,userRepository,adminWalletRepository)
const getBookingDetails = new GetBookingDetails(bookingRepository)
const getDepartments = new GetDepartmentsUser(departmentRepository);
const getUserWallet = new GetUserWalletUseCase(userRepository)
const getFilteredDoctors = new GetFilteredDoctorsUseCase(doctorRepository,departmentRepository)


export const userController = new UserController(
  loginUser,
  bookWithWalletUseCase,
  registerUser,
  verifyUserOtp,
  sendUserOtp,
  logoutUser,
  googleLoginUser,
  sendResetOtp,
  resetPassword,
  getAllDoctorsForUser,
  getDoctorById,
  createStripeSession,
  getBookedSlots,
  getUserProfile,
  getUserBookings,
  cancelBooking,
  getBookingDetails,
  getDepartments,
  getUserWallet,
  getFilteredDoctors,
);

export const userAuthController = new AuthController(jwtService, "refreshToken")