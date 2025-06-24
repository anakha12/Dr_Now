import { Request, Response } from "express";
import { DoctorRepositoryImpl } from "../../infrastructure/database/repositories/doctorRepositoryImpl";
import { DoctorRegisterDTO } from "../../application/dto/doctorRegister.dto";
import { SendDoctorOtp } from "../../application/use_cases/doctor/sendDoctorOtp";
import { VerifyDoctorOtp } from "../../application/use_cases/doctor/verifyOtp";
import { DoctorLogin } from "../../application/use_cases/doctor/doctorLogin";
import { GetDoctorProfile } from "../../application/use_cases/doctor/getDoctorProfile";
import { UpdateDoctorProfile } from "../../application/use_cases/doctor/updateDoctorProfile";
import { cookieAuth, AuthRequest } from "../../interfaces/middleware/cookieAuth";
import {AddDoctorAvailability} from "../../application/use_cases/doctor/addDoctorAvailability";
import { GetDoctorAvailability } from "../../application/use_cases/doctor/getDoctorAvailability";
import { GetDoctorBookings } from "../../application/use_cases/doctor/getDoctorBookings"; 
import { BookingRepositoryImpl } from "../../infrastructure/database/repositories/bookingRepositoryImpl";
import { EditDoctorAvailability } from "../../application/use_cases/doctor/editDoctorAvailability";
import { RemoveDoctorSlot } from "../../application/use_cases/doctor/removeDoctorSlot";
import { CancelDoctorBooking } from "../../application/use_cases/doctor/cancelDoctorBooking";


interface MulterFiles {
  profileImage?: Express.Multer.File[];
  medicalLicense?: Express.Multer.File[];
  idProof?: Express.Multer.File[];
}

 export interface MulterRequest extends Request {
  files?: {
    [fieldname: string]: Express.Multer.File[]; 
  };
}

export class DoctorController {
  private sendDoctorOtp: SendDoctorOtp;
  private doctorRepository: DoctorRepositoryImpl;
  private verifyDoctorOtp: VerifyDoctorOtp; 
  private loginUseCase: DoctorLogin;
  private getDoctorProfileUseCase: GetDoctorProfile;
  private updateDoctorProfileUseCase: UpdateDoctorProfile;
  private addAvailabilityUseCase: AddDoctorAvailability;
  private getAvailabilityUseCase: GetDoctorAvailability;
  private getDoctorBookingsUseCase: GetDoctorBookings;
  private bookingRepository: BookingRepositoryImpl;
  private editAvailabilityUseCase:EditDoctorAvailability;
  private removeDoctorSlotUseCase:RemoveDoctorSlot;
  private cancelDoctorBookingUseCase: CancelDoctorBooking;
  constructor() {
    this.doctorRepository = new DoctorRepositoryImpl();
     this.bookingRepository = new BookingRepositoryImpl();
    this.sendDoctorOtp = new SendDoctorOtp(this.doctorRepository);
    this.verifyDoctorOtp = new VerifyDoctorOtp(this.doctorRepository);
    this.loginUseCase = new DoctorLogin(this.doctorRepository);
    this.getDoctorProfileUseCase = new GetDoctorProfile(this.doctorRepository);
    this.updateDoctorProfileUseCase = new UpdateDoctorProfile(this.doctorRepository);
    this.addAvailabilityUseCase = new AddDoctorAvailability(this.doctorRepository);
    this.getAvailabilityUseCase = new GetDoctorAvailability(this.doctorRepository);
    this.getDoctorBookingsUseCase = new GetDoctorBookings(this.bookingRepository);
    this.editAvailabilityUseCase = new EditDoctorAvailability(this.doctorRepository);
    this.removeDoctorSlotUseCase = new RemoveDoctorSlot(this.doctorRepository);
    this.cancelDoctorBookingUseCase = new CancelDoctorBooking(this.bookingRepository);
  }

  // Registration endpoint
  async sendOtp(req: MulterRequest, res: Response): Promise<void> {
    try {

      console.log("BODY:", req.body);
      console.log("FILES:", req.files);

      const dto = new DoctorRegisterDTO({
        ...req.body,
        profileImage: req.files?.profileImage?.[0]?.filename ? `uploads/${req.files.profileImage[0].filename}` : "",
        medicalLicense: req.files?.medicalLicense?.[0]?.filename ? `uploads/${req.files.medicalLicense[0].filename}` : "",
        idProof: req.files?.idProof?.[0]?.filename ? `uploads/${req.files.idProof[0].filename}` : "",
        availability: req.body.availability || "", 
      });

      await this.sendDoctorOtp.execute(dto);
      res.status(200).json({ message: `OTP sent to ${dto.email}` });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

   async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        res.status(400).json({ message: "Email and OTP are required" });
        return;
      }

      await this.verifyDoctorOtp.execute(email, otp);
      res.status(200).json({ message: "OTP verified successfully" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

async login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const result = await this.loginUseCase.execute(email, password);

    if ("isRejected" in result && result.isRejected) {
      res.status(200).json({ isRejected: true, name: result.name, email: result.email });
      return;
    }

    if ("notVerified" in result && result.notVerified) {
      res.status(200).json({ notVerified: true, name: result.name, email: result.email });
      return;
    }

    
    res.status(200).json({
      token: (result as { token: string; name: string }).token,
      name: result.name,
    });


  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}



  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const doctorId = req.user?.userId; 
      
      if (!doctorId) throw new Error("Unauthorized");

      const profile = await this.getDoctorProfileUseCase.execute(doctorId);
      
      res.status(200).json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const doctorId = req.user?.userId;
      console.log("Updating doctor profile for ID:", doctorId);
      const updatedProfile = await this.updateDoctorProfileUseCase.execute(doctorId, req.body);
      res.status(200).json(updatedProfile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async addAvailability(req: AuthRequest, res: Response): Promise<void> {
    try {
      const doctorId = req.params.doctorId;
      const { date, from,to } = req.body;
      const result = await this.addAvailabilityUseCase.execute(doctorId, { date, from,to });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async fetchAvailability(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.doctorId;
      const availability = await this.getAvailabilityUseCase.execute(doctorId);
      res.status(200).json(availability);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

async removeAvailabilitySlot(req: Request, res: Response): Promise<void> {
  try {
    const doctorId = req.params.doctorId;
    const { date, from, to } = req.body;

    if (!date || !from || !to) {
       res.status(400).json({ error: "Missing date, from, or to" });
       return
    }

    await this.removeDoctorSlotUseCase.execute(doctorId, date, { from, to });

    res.status(200).json({ message: "Slot removed successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

async getBookings(req: AuthRequest, res: Response): Promise<void> {
  try {
    const doctorId = req.user?.userId;
    if (!doctorId) throw new Error("Unauthorized");

    const bookings = await this.getDoctorBookingsUseCase.execute(doctorId);
    res.status(200).json(bookings);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

async editAvailability(req: AuthRequest, res: Response): Promise<void> {
  try {
    const doctorId = req.params.doctorId;
    const { date, from, to, oldFrom, oldTo, oldDate } = req.body;

    if (!doctorId || !date || !from || !to || !oldFrom || !oldTo || !oldDate) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const result = await this.editAvailabilityUseCase.execute(
      doctorId,
      { date: oldDate, from: oldFrom, to: oldTo },
      { date, from, to }
    );

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

async cancelBooking(req: AuthRequest, res: Response): Promise<void> {
  try {
    const doctorId = req.user?.userId;
    if (!doctorId) throw new Error("Unauthorized");

    const bookingId = req.params.bookingId;

    await this.cancelDoctorBookingUseCase.execute(doctorId, bookingId);

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}


}