import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

// import { UserRegisterDTO } from "../../application/dto/userRegister.dto";
import { HttpStatus } from "../../utils/HttpStatus";
import { Messages } from "../../utils/Messages";
import { ILoginUser } from "../../application/use_cases/interfaces/user/ILoginUser";
import { IBookWithWallet } from "../../application/use_cases/interfaces/user/IBookWithWallet";
import { IRegisterUser } from "../../application/use_cases/interfaces/user/IRegisterUser";
import { IVerifyUserOtp } from "../../application/use_cases/interfaces/user/IVerifyUserOtp";
import { ISendResetOtp } from "../../application/use_cases/interfaces/user/ISendResetOtp";
import { ISendUserOtp } from "../../application/use_cases/interfaces/user/ISendUserOtp";
import { IUserLogout } from "../../application/use_cases/interfaces/user/IUserLogout";
import { IGoogleLoginUser } from "../../application/use_cases/interfaces/user/IGoogleLoginUser";
import { IResetPassword } from "../../application/use_cases/interfaces/user/IResetPassword";
import { IGetAllDoctorsForUser } from "../../application/use_cases/interfaces/user/IGetAllDoctorsForUser";
import { IGetDoctorById } from "../../application/use_cases/interfaces/user/IGetDoctorById";
import { ICreateStripeSession } from "../../application/use_cases/interfaces/user/ICreateStripeSession";
import { IGetBookedSlots } from "../../application/use_cases/interfaces/user/IGetBookedSlots";
import { IGetUserProfile } from "../../application/use_cases/interfaces/user/IGetUserProfile";
import { IGetUserBookings } from "../../application/use_cases/interfaces/user/IGetUserBookings";
import { ICancelUserBooking } from "../../application/use_cases/interfaces/user/ICancelUserBooking";
import { IGetBookingDetails } from "../../application/use_cases/interfaces/user/IGetBookingDetails";
import { IGetDepartmentsUser } from "../../application/use_cases/interfaces/user/IGetDepartmentsUser";
import { IGetUserWallet } from "../../application/use_cases/interfaces/user/IGetUserWallet";
import { IGetFilteredDoctors } from "../../application/use_cases/interfaces/user/IGetFilteredDoctors";

import { UserRegisterDTO } from "../dto/request/user-register.dto";
import { UserLoginDTO } from "../dto/request/user-login.dto";


interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}
export class UserController {
  constructor(
      private _userLogin: ILoginUser,
      private _bookWithWalletUseCase: IBookWithWallet,
      private _registerUser: IRegisterUser,
      private _verifyUserOtp: IVerifyUserOtp,
      private _sendUserOtp: ISendUserOtp,
      private _logoutUserUseCase: IUserLogout,
      private _googleLoginUser: IGoogleLoginUser,
      private _sendResetOtp: ISendResetOtp,
      private _resetPassword: IResetPassword,
      private _getAllDoctorsForUserUseCase: IGetAllDoctorsForUser,
      private _getDoctorByIdUseCase: IGetDoctorById,
      private _createStripeSessionUseCase: ICreateStripeSession,
      private _getBookedSlotsUseCase: IGetBookedSlots,
      private _getUserProfileUseCase: IGetUserProfile,
      private _getUserBookingsUseCase: IGetUserBookings,
      private _cancelUserBookingUseCase: ICancelUserBooking,
      private _getBookingDetailsUseCase: IGetBookingDetails,
      private _getDepartmentsUseCase: IGetDepartmentsUser,
      private _getUserWalletUseCase: IGetUserWallet,
      private _getFilteredDoctorsUseCase: IGetFilteredDoctors,
  ) {}
  
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
  
      const dto = plainToInstance(UserRegisterDTO, req.body);
     
      const errors = await validate(dto); 
       console.log("error",errors)
      if (errors.length > 0) {
        const formattedErrors = errors
          .map(err => Object.values(err.constraints || {}))
          .flat();

         res.status(HttpStatus.BAD_REQUEST).json({
          error: formattedErrors,
        });
      }

      await this._sendUserOtp.execute(dto);
      res.status(HttpStatus.OK).json({ message: `OTP sent to ${dto.email}` });
    } catch (err: any) {
      console.error("Send OTP error:", err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: Messages.FAILED_SENSD_OTP });
    }
  }

 async login(req: Request, res: Response): Promise<void> {
  try {
    // const { email, password } = req.body;

    const  dto = plainToInstance( UserLoginDTO, req.body)
    const { token, user } = await this._userLogin.execute(dto)

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

 async logoutUserController(req: Request, res: Response): Promise<void> {
  try {
    res.clearCookie("userAccessToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    const result = await this._logoutUserUseCase.execute();
    res.status(HttpStatus.OK).json(result);
  } catch (error: any) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ success: false, message: err.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ success: false, message: "Unexpected error" });
      }
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
