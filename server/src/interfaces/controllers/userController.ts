import { Request, Response } from "express";
import { handleControllerError } from "../../utils/errorHandler";
import { HttpStatus } from "../../utils/HttpStatus";
import { ErrorMessages, Messages } from "../../utils/Messages";
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
import { IGetDoctorAvailabilityRules } from "../../application/use_cases/interfaces/user/IGetDoctorAvailabilityRules";
import { IGetDoctorAvailabilityExceptions } from "../../application/use_cases/interfaces/user/IGetDoctorAvailabilityExceptions";
import { IUpdateUserProfileUseCase } from "../../application/use_cases/interfaces/user/IUpdateUserProfile";


interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
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
      private _getDoctorAvailabilityRulesUseCase: IGetDoctorAvailabilityRules,
      private _getDoctorAvailabilityExceptionsUseCase: IGetDoctorAvailabilityExceptions,
      private _updateUserProfileUseCase: IUpdateUserProfileUseCase,
  ) {}
  
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, otp } = req.body;    
      await this._verifyUserOtp.execute(email, otp);
      const userData = { email, password } as any;
      await this._registerUser.execute(userData);
      res.status(HttpStatus.CREATED).json({ message: Messages.USER_REGISTERED_SUCCESSFULLY });
    } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.BAD_REQUEST);
    }
  }

  async sendOtp(req: Request, res: Response): Promise<void> {
    try {

      const result = await this._sendUserOtp.execute(req.body);
      res.status(HttpStatus.OK).json({ message: Messages.OTP_SENT });
    } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

 async login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await this._userLogin.execute(req.body);

    const accessTokenMaxAge= Number(process.env.ACCESS_TOKEN_COOKIE_MAXAGE);
    const refreshTokenMaxAge= Number(process.env.REFRESH_TOKEN_COOKIE_MAXAGE);
  
    res.cookie("userAccessToken", accessToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",                               
      maxAge: accessTokenMaxAge,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: refreshTokenMaxAge,
    });

    res.status(HttpStatus.OK).json({ message: Messages.LOGIN_SUCCESSFUL, user });
  } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.BAD_REQUEST);
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
  } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
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
    } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.BAD_REQUEST);
    }
  }

  async sendResetOtpHandler(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this._sendResetOtp.execute(email);
      res.status(HttpStatus.OK).json({ message: Messages.RESET_OTP_SENT });
    } catch (err: unknown) {
      handleControllerError(res, err);
    }
  }

  async resetPasswordHandler(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp, newPassword } = req.body;
      await this._resetPassword.execute(email, otp, newPassword);
      res.status(HttpStatus.OK).json({ message:Messages.PASSWORD_RESET_SUCCESSFUL });
    } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllDoctors(req: Request, res: Response): Promise<void> {
    try {
      const doctors = await this._getAllDoctorsForUserUseCase.execute();
      res.status(HttpStatus.OK).json(doctors);
    } catch (err: unknown) {
      handleControllerError(res, err);
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
    } catch (err: unknown) {
      handleControllerError(res, err);
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
    } catch (err: unknown) {
      handleControllerError(res, err);
    }
  }

  async getBookedSlots(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.doctorId;
      const date = req.query.date as string;
      if (!doctorId || !date) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: Messages.MISSING_DOCTOR_AND_DATE });
        return;
      }

      const slots = await this._getBookedSlotsUseCase.execute(doctorId, date);
      res.status(HttpStatus.OK).json(slots);
    } catch (err: unknown) {
      handleControllerError(res, err);
    }
  }


   async getUserProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId =  req.user?.id;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error:Messages.UNAUTHORIZED });
        return;
      }
      const user = await this._getUserProfileUseCase.execute(userId);
      res.status(HttpStatus.OK).json(user);
    } catch (err: unknown) {
      handleControllerError(res, err);
    }
  }

  async getUserBookings(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 4;

    const { bookings, totalPages } = await this._getUserBookingsUseCase.execute(userId, page, limit);

    res.status(HttpStatus.OK).json({ bookings, totalPages, currentPage: page });
  } catch (err: unknown) {
      handleControllerError(res, err);
  }
}


    async cancelBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
      try {
        const userId = req.user?.id;
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
      } catch (err: unknown) {
        handleControllerError(res, err);
      }
    }

  
  async getDepartments(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const depts = await this._getDepartmentsUseCase.execute(page, limit);
      res.status(HttpStatus.OK).json({ departments: depts });
    } catch (err: unknown) {
      handleControllerError(res, err);
    }
  }

  async getWalletInfo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const page = parseInt(req.query.page as string)||0;
      const limit = parseInt(req.query.limit as string)||0;


      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED});
        return;
      }

      const walletData = await this._getUserWalletUseCase.execute(userId, page, limit);
      res.status(HttpStatus.OK).json(walletData);
    } catch (err: unknown) {
      handleControllerError(res, err);
    }
  }

  async bookWithWallet(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
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
    } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.BAD_REQUEST);
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
    } catch (err: unknown) {
      handleControllerError(res, err);
    }
  }

  async getBookingDetails(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const bookingId = req.params.id;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED });
        return;
      }

      const booking = await this._getBookingDetailsUseCase.execute(bookingId, userId);
      res.status(HttpStatus.OK).json(booking);
    }  catch (err: unknown) {
      handleControllerError(res, err);
    }
  }

async getDoctorAvailabilityRules(req: Request, res: Response) {
  try {
    const { doctorId } = req.params;

    const rules = await this._getDoctorAvailabilityRulesUseCase.execute(doctorId);

    res.status(HttpStatus.OK).json(rules);
  } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.BAD_REQUEST);
  }
}

async getDoctorAvailabilityExceptions(req: Request, res: Response) {
  try {
    const { doctorId } = req.params;

    const exceptions = await this._getDoctorAvailabilityExceptionsUseCase.execute({doctorId});
    res.status(HttpStatus.OK).json(exceptions);
  } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.BAD_REQUEST);
  }
}

async updateUserProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ error: Messages.UNAUTHORIZED });
    }

    const data = { ...req.body }; 
    if (req.file) data.file = req.file; 

    const updatedUser = await this._updateUserProfileUseCase.execute(userId, data);

    return res.status(HttpStatus.OK).json({ user: updatedUser });
  } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.BAD_REQUEST);
  }
}




}