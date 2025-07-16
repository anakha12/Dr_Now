import { Request, Response } from "express";
import { RegisterUser } from "../../application/use_cases/user/registerUser";
import { SendUserOtp } from "../../application/use_cases/user/sendUserOtp";
import { LoginUser } from "../../application/use_cases/user/loginUser";
import { UserRegisterDTO } from "../../application/dto/userRegister.dto";
import { VerifyUserOtp } from "../../application/use_cases/user/verifyUserOtp";
import { GoogleLoginUser } from "../../application/use_cases/user/googleLoginUser";
import { SendResetOtp } from "../../application/use_cases/user/sendResetOtp";
import { ResetPassword } from "../../application/use_cases/user/resetPassword";
import { GetAllDoctorsForUser } from "../../application/use_cases/user/getAllDoctorsForUser";
import { GetDoctorById } from "../../application/use_cases/user/getDoctorById";
import { CreateStripeSession } from "../../application/use_cases/user/createStripeSession";
import { stripe } from "../../config/stripe"; 
import { GetBookedSlots } from "../../application/use_cases/user/getBookedSlots";
import { GetUserProfile } from "../../application/use_cases/user/getUserProfile";
import { GetUserBookings } from "../../application/use_cases/user/getUserBookings";
import { CancelUserBookingUseCase } from "../../application/use_cases/user/cancelUserBooking";
import { GetDepartmentsUser } from "../../application/use_cases/user/getDepartmentsUser";
import { GetUserWalletUseCase } from "../../application/use_cases/user/getUserWallet";
import { BookWithWalletUseCase } from "../../application/use_cases/user/bookWithWallet";
import { GetFilteredDoctorsUseCase } from "../../application/use_cases/user/getFilteredDoctors";
import { GetBookingDetails } from "../../application/use_cases/user/getBookingDetails";

import { IUserRepository } from "../../domain/repositories/userRepository";
import { IDoctorRepository } from "../../domain/repositories/doctorRepository";
import { IDepartmentRepository } from "../../domain/repositories/departmentRepository";
import { IBookingRepository } from "../../domain/repositories/bookingRepository";
import { IAdminWalletRepository } from "../../domain/repositories/adminWalletRepository";
import { HttpStatus } from "../../utils/HttpStatus";
import { Messages } from "../../utils/Messages";

interface UserControllerDependencies {
  userRepository: IUserRepository;
  doctorRepository: IDoctorRepository;
  departmentRepository: IDepartmentRepository;
  bookingRepository: IBookingRepository;
  adminWalletRepository: IAdminWalletRepository;
}

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}
export class UserController {
  private _registerUser: RegisterUser;
  private _sendUserOtp: SendUserOtp;
  private _verifyUserOtp: VerifyUserOtp;
  private _loginUser: LoginUser;
  private _googleLoginUser: GoogleLoginUser;
  private _sendResetOtp: SendResetOtp;
  private _resetPassword: ResetPassword;
  private _getAllDoctorsForUserUseCase: GetAllDoctorsForUser;
  private _getDoctorByIdUseCase: GetDoctorById;
  private _createStripeSessionUseCase: CreateStripeSession;
  private _getBookedSlotsUseCase: GetBookedSlots;
  private _getUserProfileUseCase: GetUserProfile;
  private _getUserBookingsUseCase: GetUserBookings;
  private _cancelUserBookingUseCase: CancelUserBookingUseCase;
  private _getDepartmentsUseCase: GetDepartmentsUser;
  private _getUserWalletUseCase: GetUserWalletUseCase;
  private _bookWithWalletUseCase: BookWithWalletUseCase;
  private _getFilteredDoctorsUseCase: GetFilteredDoctorsUseCase;
  private _getBookingDetailsUseCase: GetBookingDetails;


  constructor(deps:UserControllerDependencies) {
    this._registerUser = new RegisterUser(deps.userRepository);
    this._sendUserOtp = new SendUserOtp(deps.userRepository);
    this._verifyUserOtp = new VerifyUserOtp(deps.userRepository);
    this._loginUser = new LoginUser(deps.userRepository);
    this._googleLoginUser = new GoogleLoginUser(deps.userRepository);
    this._sendResetOtp = new SendResetOtp(deps.userRepository);
    this._resetPassword = new ResetPassword(deps.userRepository);
    this._getAllDoctorsForUserUseCase = new GetAllDoctorsForUser(deps.doctorRepository);
    this._getDoctorByIdUseCase = new GetDoctorById(deps.doctorRepository);
    this._getBookedSlotsUseCase = new GetBookedSlots(deps.bookingRepository);
    this._createStripeSessionUseCase = new CreateStripeSession(
      deps.doctorRepository,
      stripe
    );
    this._getUserProfileUseCase = new GetUserProfile(deps.userRepository);
    this._getUserBookingsUseCase = new GetUserBookings(deps.bookingRepository);
    this._cancelUserBookingUseCase = new CancelUserBookingUseCase(
      deps.bookingRepository,
      deps.userRepository,
      deps.adminWalletRepository
    );
    this._getDepartmentsUseCase = new GetDepartmentsUser(deps.departmentRepository);
    this._getUserWalletUseCase = new GetUserWalletUseCase(deps.userRepository);
    this._getFilteredDoctorsUseCase = new GetFilteredDoctorsUseCase(
      deps.doctorRepository,
      deps.departmentRepository
    );
    this._bookWithWalletUseCase = new BookWithWalletUseCase(
      deps.userRepository,
      deps.doctorRepository,
      deps.bookingRepository,
      deps.adminWalletRepository
    );
    this._getBookingDetailsUseCase = new GetBookingDetails(deps.bookingRepository);

  }

  
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, otp } = req.body;    
      await this._verifyUserOtp.execute(email, otp);
      const userData = { email, password } as any;
      await this._registerUser.execute(userData);
      res.status(HttpStatus.CREATED).json({ message: Messages.USER_REGISTERED_SUCCESSFULLY });
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
    }
  }

  async sendOtp(req: Request, res: Response): Promise<void> {
    try {
      const dto = new UserRegisterDTO(req.body);
      await this._sendUserOtp.execute(dto);
      res.status(HttpStatus.OK).json({ message: `OTP sent to ${dto.email}` });
    } catch (err: any) {
      console.error("Send OTP error:", err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: Messages.FAILED_SENSD_OTP });
    }
  }

 async login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const { token, user } = await this._loginUser.execute(email, password);

    res.cookie("userAccessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, 
    });
    res.status(HttpStatus.OK).json({ message: Messages.LOGIN_SUCCESSFUL, user });
  } catch (err: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
  }
}

  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, name, uid } = req.body;
      if (!email || !uid) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: Messages.MISSING_GOOGLE_INFO });
        return;
      }
      const result = await this._googleLoginUser.execute({ email, name, uid });
      res.status(HttpStatus.OK).json(result);
    } catch (err: any) {
      console.error("Google login error:", err.message);
      res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
    }
  }

  async sendResetOtpHandler(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this._sendResetOtp.execute(email);
      res.status(HttpStatus.OK).json({ message: Messages.RESET_OTP_SENT });
    } catch (err: any) {
      console.error("Send reset OTP error:", err.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
  }

  async resetPasswordHandler(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp, newPassword } = req.body;
      await this._resetPassword.execute(email, otp, newPassword);
      res.status(HttpStatus.OK).json({ message:Messages.PASSWORD_RESET_SUCCESSFUL });
    } catch (err: any) {
      console.error("Reset password error:", err.message);
      res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
    }
  }

  async getAllDoctors(req: Request, res: Response): Promise<void> {
    try {
      const doctors = await this._getAllDoctorsForUserUseCase.execute();
      res.status(HttpStatus.OK).json(doctors);
    } catch (err: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async getDoctorById(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.id;
      const doctor = await this._getDoctorByIdUseCase.execute(doctorId);
      if (!doctor) {
        res.status(HttpStatus.NOT_FOUND).json({ message: Messages.DOCTOR_NOT_FOUND });
        return;
      }
      res.status(HttpStatus.OK).json(doctor);
    } catch (err: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async createCheckoutSession(req: Request, res: Response): Promise<void> {
    try {
      const { doctorId, userId, slot, fee, date } = req.body;
      const { sessionId } = await this._createStripeSessionUseCase.execute(
        doctorId,
        userId,
        slot,
        fee,
        date
      );

      res.status(HttpStatus.OK).json({
        sessionId,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      });
    } catch (error: any) {
      console.error("Stripe session error:", error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  async getBookedSlots(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.doctorId;
      const date = req.query.date as string;

      if (!doctorId || !date) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: Messages.MISSING_DOCTOR_AND_DATE});
        return;
      }

      const slots = await this._getBookedSlotsUseCase.execute(doctorId, date);
      res.status(HttpStatus.OK).json(slots);
    } catch (err: any) {
      console.error("Get booked slots error:", err.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: Messages.SLOT_FETCH_FAILED });
    }
  }

   async getUserProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId =  req.user?.userId;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error:Messages.UNAUTHORIZED });
        return;
      }
      const user = await this._getUserProfileUseCase.execute(userId);
      res.status(HttpStatus.OK).json(user);
    } catch (err: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
  }

  async getUserBookings(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 4;

    const { bookings, totalPages } = await this._getUserBookingsUseCase.execute(userId, page, limit);

    res.status(HttpStatus.OK).json({ bookings, totalPages, currentPage: page });
  } catch (err: any) {
    console.error("Get user bookings error:", err.message);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: Messages.SLOT_FETCH_FAILED });
  }
}


    async cancelBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
      try {
        const userId = req.user?.userId;
        const bookingId = req.params.id;
        const reason=req.body.reason;

        if(!reason || reason.trim()===""){
          res.status(HttpStatus.BAD_REQUEST).json({ error: Messages.CANCEL_ERROR });
          return;
        }
        if (!userId) {
          res.status(HttpStatus.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED});
          return;
        }

        const result = await this._cancelUserBookingUseCase.execute(bookingId, userId, req.body.reason);

        if (!result.success) {
          res.status(HttpStatus.BAD_REQUEST).json({ error: result.message });
          return;
        }

        res.status(HttpStatus.OK).json({ message: Messages.BOOKING_CANCELLED });
      } catch (err: any) {
        console.error("Cancel booking error:", err.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: Messages.BOOKING_FAILED});
      }
    }

  
  async getDepartments(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const depts = await this._getDepartmentsUseCase.execute(page, limit);
      res.status(HttpStatus.OK).json({ departments: depts });
    } catch (err: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async getWalletInfo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const page = parseInt(req.query.page as string)||0;
      const limit = parseInt(req.query.limit as string)||0;


      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED});
        return;
      }

      const walletData = await this._getUserWalletUseCase.execute(userId, page, limit);
      res.status(HttpStatus.OK).json(walletData);
    } catch (error: any) {
      console.error("Wallet error:", error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message || "Internal server error" });
    }
  }

  async bookWithWallet(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED });
        return;
      }

      const { doctorId, slot, amount, date } = req.body;

      if (!doctorId || !slot || !amount || !date) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: Messages.MISSING_BOOKING_DATA});
        return;
      }

      const result = await this._bookWithWalletUseCase.execute(userId, doctorId, slot, amount, date);
      res.status(HttpStatus.OK).json(result);
    } catch (err: any) {
      console.error("Book with wallet error:", err.message);
      res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
    }
  }

  async getFilteredDoctors(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        search: req.query.search as string,
        specialization: req.query.specialization as string,
        maxFee: req.query.maxFee ? parseFloat(req.query.maxFee as string) : undefined,
        gender: req.query.gender as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 6,
      };

      const result = await this._getFilteredDoctorsUseCase.execute(filters);
      res.status(HttpStatus.OK).json(result);
    } catch (err: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async getBookingDetails(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const bookingId = req.params.id;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED });
        return;
      }

      const booking = await this._getBookingDetailsUseCase.execute(bookingId, userId);
      res.status(HttpStatus.OK).json(booking);
    } catch (err: any) {
      const status = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({ error: err.message });
    }
  }




  
}
