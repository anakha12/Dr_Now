import { Request, Response } from "express";
import { RegisterUser } from "../../application/use_cases/user/registerUser";
import { SendUserOtp } from "../../application/use_cases/user/sendUserOtp";
import { LoginUser } from "../../application/use_cases/user/loginUser";
import { UserRepositoryImpl } from "../../infrastructure/database/repositories/userRepositoryImpl";
import { UserRegisterDTO } from "../../application/dto/userRegister.dto";
import { VerifyUserOtp } from "../../application/use_cases/user/verifyUserOtp";
import { GoogleLoginUser } from "../../application/use_cases/user/googleLoginUser";
import { SendResetOtp } from "../../application/use_cases/user/sendResetOtp";
import { ResetPassword } from "../../application/use_cases/user/resetPassword";
import { DoctorRepositoryImpl } from "../../infrastructure/database/repositories/doctorRepositoryImpl";
import { GetAllDoctorsForUser } from "../../application/use_cases/user/getAllDoctorsForUser";
import { GetDoctorById } from "../../application/use_cases/user/getDoctorById";
import { CreateStripeSession } from "../../application/use_cases/user/createStripeSession";
import { stripe } from "../../config/stripe"; 
import { GetBookedSlots } from "../../application/use_cases/user/getBookedSlots";
import { BookingRepositoryImpl } from "../../infrastructure/database/repositories/bookingRepositoryImpl";
import { GetUserProfile } from "../../application/use_cases/user/getUserProfile";
import { GetUserBookings } from "../../application/use_cases/user/getUserBookings";
import { CancelUserBookingUseCase } from "../../application/use_cases/user/cancelUserBooking";
import { GetDepartmentsUser } from "../../application/use_cases/user/getDepartmentsUser";
import { DepartmentRepositoryImpl } from "../../infrastructure/database/repositories/departmentRepositoryImpl";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}
export class UserController {
  private userRepository: UserRepositoryImpl;
  private registerUser: RegisterUser;
  private sendUserOtp: SendUserOtp;
  private verifyUserOtp: VerifyUserOtp;
  private loginUser: LoginUser;
  private googleLoginUser: GoogleLoginUser;
  private sendResetOtp: SendResetOtp;
  private resetPassword: ResetPassword;
  private getAllDoctorsForUserUseCase: GetAllDoctorsForUser;
  private getDoctorByIdUseCase: GetDoctorById;
  private createStripeSessionUseCase: CreateStripeSession;
  private getBookedSlotsUseCase: GetBookedSlots;
  private getUserProfileUseCase: GetUserProfile;
  private getUserBookingsUseCase: GetUserBookings;
  private cancelUserBookingUseCase: CancelUserBookingUseCase;
  private getDepartmentsUseCase: GetDepartmentsUser;
  constructor() {
    this.userRepository = new UserRepositoryImpl();
    this.registerUser = new RegisterUser(this.userRepository);
    this.sendUserOtp = new SendUserOtp(this.userRepository);
    this.verifyUserOtp = new VerifyUserOtp(this.userRepository);
    this.loginUser = new LoginUser(this.userRepository);
    this.googleLoginUser = new GoogleLoginUser(this.userRepository);
    this.sendResetOtp = new SendResetOtp(this.userRepository);
    this.resetPassword = new ResetPassword(this.userRepository);
    this.getAllDoctorsForUserUseCase = new GetAllDoctorsForUser(new DoctorRepositoryImpl());
    this.getDoctorByIdUseCase = new GetDoctorById(new DoctorRepositoryImpl());
    this.getBookedSlotsUseCase = new GetBookedSlots(new BookingRepositoryImpl());
    this.createStripeSessionUseCase = new CreateStripeSession(
      new DoctorRepositoryImpl(),
      stripe
    );
    this.getUserProfileUseCase = new GetUserProfile(this.userRepository);
    this.getUserBookingsUseCase = new GetUserBookings(new BookingRepositoryImpl());
    this.cancelUserBookingUseCase = new CancelUserBookingUseCase(new BookingRepositoryImpl());
    const deptRepo = new DepartmentRepositoryImpl();
    this.getDepartmentsUseCase = new GetDepartmentsUser(deptRepo);

  }

  
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, otp } = req.body;
      await this.verifyUserOtp.execute(email, otp);
      const userData = { email, password } as any;
      await this.registerUser.execute(userData);
      res.status(201).json({ message: "User registered successfully" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async sendOtp(req: Request, res: Response): Promise<void> {
    try {
      const dto = new UserRegisterDTO(req.body);
      await this.sendUserOtp.execute(dto);
      res.status(200).json({ message: `OTP sent to ${dto.email}` });
    } catch (err: any) {
      console.error("Send OTP error:", err);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  }

 async login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const { token, user } = await this.loginUser.execute(email, password);

    res.cookie("userAccessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.status(200).json({ message: "Login successful", user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, name, uid } = req.body;
      if (!email || !uid) {
        res.status(400).json({ error: "Missing Google login info" });
        return;
      }
      const result = await this.googleLoginUser.execute({ email, name, uid });
      res.status(200).json(result);
    } catch (err: any) {
      console.error("Google login error:", err.message);
      res.status(400).json({ error: err.message });
    }
  }

  async sendResetOtpHandler(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this.sendResetOtp.execute(email);
      res.status(200).json({ message: "Reset OTP sent to email" });
    } catch (err: any) {
      console.error("Send reset OTP error:", err.message);
      res.status(500).json({ error: err.message });
    }
  }

  async resetPasswordHandler(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp, newPassword } = req.body;
      await this.resetPassword.execute(email, otp, newPassword);
      res.status(200).json({ message: "Password reset successful" });
    } catch (err: any) {
      console.error("Reset password error:", err.message);
      res.status(400).json({ error: err.message });
    }
  }

  async getAllDoctors(req: Request, res: Response): Promise<void> {
    try {
      const doctors = await this.getAllDoctorsForUserUseCase.execute();
      res.status(200).json(doctors);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async getDoctorById(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.id;
      const doctor = await this.getDoctorByIdUseCase.execute(doctorId);
      if (!doctor) {
        res.status(404).json({ message: "Doctor not found" });
        return;
      }
      res.status(200).json(doctor);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async createCheckoutSession(req: Request, res: Response): Promise<void> {
    try {
      const { doctorId, userId, slot, fee, date } = req.body;
      const { sessionId } = await this.createStripeSessionUseCase.execute(
        doctorId,
        userId,
        slot,
        fee,
        date
      );

      res.status(200).json({
        sessionId,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      });
    } catch (error: any) {
      console.error("Stripe session error:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  async getBookedSlots(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.doctorId;
      const date = req.query.date as string;

      if (!doctorId || !date) {
        res.status(400).json({ error: "Doctor ID and date are required" });
        return;
      }

      const slots = await this.getBookedSlotsUseCase.execute(doctorId, date);
      res.status(200).json(slots);
    } catch (err: any) {
      console.error("Get booked slots error:", err.message);
      res.status(500).json({ error: "Failed to fetch booked slots" });
    }
  }

   async getUserProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId =  req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const user = await this.getUserProfileUseCase.execute(userId);
      res.status(200).json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

    async getUserBookings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const bookings = await this.getUserBookingsUseCase.execute(userId);
      res.status(200).json(bookings);
    } catch (err: any) {
      console.error("Get user bookings error:", err.message);
      res.status(500).json({ error: "Failed to fetch user bookings" });
    }
  }

    async cancelBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const bookingId = req.params.id;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const result = await this.cancelUserBookingUseCase.execute(bookingId, userId);

      if (!result.success) {
        res.status(400).json({ error: result.message });
        return;
      }

      res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (err: any) {
      console.error("Cancel booking error:", err.message);
      res.status(500).json({ error: "Failed to cancel booking" });
    }
  }

  
  async getDepartments(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const depts = await this.getDepartmentsUseCase.execute(page, limit);
      res.status(200).json({ departments: depts });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
  
}
