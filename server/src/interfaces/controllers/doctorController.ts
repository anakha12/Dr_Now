import { Request, Response } from "express";
import { Messages } from "../../utils/Messages";
import { HttpStatus } from "../../utils/HttpStatus";
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
import { EditDoctorAvailability } from "../../application/use_cases/doctor/editDoctorAvailability";
import { RemoveDoctorSlot } from "../../application/use_cases/doctor/removeDoctorSlot";
import { CancelDoctorBooking } from "../../application/use_cases/doctor/cancelDoctorBooking";
import { GetAllDepartments } from "../../application/use_cases/doctor/getAllDepartments";
import { GetDoctorWalletSummary } from "../../application/use_cases/doctor/getDoctorWalletSummary";
import { CompleteDoctorProfile } from "../../application/use_cases/doctor/completeDoctorProfile";
import { GetBookingDetailsDoctor } from "../../application/use_cases/doctor/getBookingDetailsDoctor";

import { IUserRepository } from "../../domain/repositories/userRepository";
import { IDoctorRepository } from "../../domain/repositories/doctorRepository";
import { IDepartmentRepository } from "../../domain/repositories/departmentRepository";
import { IBookingRepository } from "../../domain/repositories/bookingRepository";
import { IAdminWalletRepository } from "../../domain/repositories/adminWalletRepository";


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

interface DoctorControllerDependencies {
  doctorRepository: IDoctorRepository;
  bookingRepository: IBookingRepository;
  userRepository: IUserRepository;
  adminWalletRepository: IAdminWalletRepository;
  departmentRepository: IDepartmentRepository;
}


export class DoctorController {
  private _sendDoctorOtp: SendDoctorOtp;
  private _verifyDoctorOtp: VerifyDoctorOtp; 
  private _loginUseCase: DoctorLogin;
  private _getDoctorProfileUseCase: GetDoctorProfile;
  private _updateDoctorProfileUseCase: UpdateDoctorProfile;
  private _addAvailabilityUseCase: AddDoctorAvailability;
  private _getAvailabilityUseCase: GetDoctorAvailability;
  private _getDoctorBookingsUseCase: GetDoctorBookings;
  private _editAvailabilityUseCase:EditDoctorAvailability;
  private _removeDoctorSlotUseCase:RemoveDoctorSlot;
  private _cancelDoctorBookingUseCase: CancelDoctorBooking;
  private _getAllDepartmentsUseCase: GetAllDepartments;
  private _getDoctorWalletSummaryUseCase: GetDoctorWalletSummary;
  private _completeProfileUseCase: CompleteDoctorProfile;
  private _getBookingDetailsDoctorUseCase: GetBookingDetailsDoctor;

  constructor(deps:DoctorControllerDependencies) {
    this._sendDoctorOtp = new SendDoctorOtp(deps.doctorRepository);
    this._verifyDoctorOtp = new VerifyDoctorOtp(deps.doctorRepository);
    this._loginUseCase = new DoctorLogin(deps.doctorRepository);
    this._getDoctorProfileUseCase = new GetDoctorProfile(deps.doctorRepository);
    this._updateDoctorProfileUseCase = new UpdateDoctorProfile(deps.doctorRepository, deps.bookingRepository);
    this._addAvailabilityUseCase = new AddDoctorAvailability(deps.doctorRepository);
    this._getAvailabilityUseCase = new GetDoctorAvailability(deps.doctorRepository);
    this._getDoctorBookingsUseCase = new GetDoctorBookings(deps.bookingRepository);
    this._editAvailabilityUseCase = new EditDoctorAvailability(deps.doctorRepository);
    this._removeDoctorSlotUseCase = new RemoveDoctorSlot(deps.doctorRepository);
    this._cancelDoctorBookingUseCase = new CancelDoctorBooking(
      deps.bookingRepository,
      deps.userRepository,
      deps.adminWalletRepository
    );
    this._getAllDepartmentsUseCase = new GetAllDepartments(deps.departmentRepository);
    this._getDoctorWalletSummaryUseCase = new GetDoctorWalletSummary(deps.doctorRepository);
    this._completeProfileUseCase = new CompleteDoctorProfile(deps.doctorRepository);
    this._getBookingDetailsDoctorUseCase = new GetBookingDetailsDoctor(deps.bookingRepository);
  }

  async sendOtp(req: MulterRequest, res: Response): Promise<void> {
    try {
      const profileImage = req.files?.profileImage?.[0];
      const medicalLicense = req.files?.medicalLicense?.[0];
      const idProof = req.files?.idProof?.[0];

      const dto = new DoctorRegisterDTO({
        ...req.body,
        profileImage: profileImage ? (profileImage as any).path : "",
        medicalLicense: medicalLicense ? (medicalLicense as any).path : "",
        idProof: idProof ? (idProof as any).path : "",
        availability: req.body.availability || "",
      });

      await this._sendDoctorOtp.execute(dto);
      res.status(HttpStatus.OK).json({ message: Messages.OTP_SENT(dto.email) });
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
    }
  }


   async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.UNAUTHORIZED });
        return;
      }

      const doctorId = await this._verifyDoctorOtp.execute(email, otp);
      res.status(HttpStatus.OK).json({ message: Messages.OTP_VERIFIED, doctorId });
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
    }
  }

async login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.UNAUTHORIZED });
      return;
    }

    const result = await this._loginUseCase.execute(email, password);

    if ("isRejected" in result && result.isRejected) {
      res.status(HttpStatus.OK).json({ isRejected: true, name: result.name, email: result.email });
      return;
    }

    if ("notVerified" in result && result.notVerified) {
      res.status(HttpStatus.OK).json({ notVerified: true, name: result.name, email: result.email });
      return;
    }

    
    res.status(200).json({
      token: (result as { token: string; name: string }).token,
      name: result.name,
    });


  } catch (err: any) {
    res.status(HttpStatus.UNAUTHORIZED).json({ error: err.message });
  }
}



  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const doctorId = req.user?.userId; 
      
     if (!doctorId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED });
      return;
    }

      const profile = await this._getDoctorProfileUseCase.execute(doctorId);
      
      res.status(HttpStatus.OK).json(profile);
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const doctorId = req.user?.userId;
      const updatedProfile = await this._updateDoctorProfileUseCase.execute(doctorId, req.body);
      res.status(HttpStatus.OK).json(updatedProfile);
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  async addAvailability(req: AuthRequest, res: Response): Promise<void> {
    try {
      const doctorId = req.params.doctorId;
      const { date, from,to } = req.body;
      const result = await this._addAvailabilityUseCase.execute(doctorId, { date, from,to });
      res.status(HttpStatus.OK).json(result);
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  async fetchAvailability(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.doctorId;
      const availability = await this._getAvailabilityUseCase.execute(doctorId);
      res.status(HttpStatus.OK).json(availability);
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

async removeAvailabilitySlot(req: Request, res: Response): Promise<void> {
  try {
    const doctorId = req.params.doctorId;
    const { date, from, to } = req.body;

    if (!date || !from || !to) {
       res.status(HttpStatus.BAD_REQUEST).json({ error:Messages.MISSING_BOOKING_DATA });
       return
    }

    await this._removeDoctorSlotUseCase.execute(doctorId, date, { from, to });

    res.status(HttpStatus.OK).json({ message: Messages.SLOT_REMOVED});
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
}

async getBookings(req: AuthRequest, res: Response): Promise<void> {
  try {
    const doctorId = req.user?.userId;
    if (!doctorId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const result = await this._getDoctorBookingsUseCase.execute(doctorId, page, limit);

    res.status(HttpStatus.OK).json(result); 
  } catch (err: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
  }
}


async editAvailability(req: AuthRequest, res: Response): Promise<void> {
  try {
    const doctorId = req.params.doctorId;
    const { date, from, to, oldFrom, oldTo, oldDate } = req.body;

    if (!doctorId || !date || !from || !to || !oldFrom || !oldTo || !oldDate) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: Messages.MISSING_FIELDS });
      return;
    }

    const result = await this._editAvailabilityUseCase.execute(
      doctorId,
      { date: oldDate, from: oldFrom, to: oldTo },
      { date, from, to }
    );

    res.status(HttpStatus.OK).json(result);
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
}

async cancelBooking(req: AuthRequest, res: Response): Promise<void> {
  try {
    const doctorId = req.user?.userId;
    if (!doctorId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED });
      return;
    }
    const reason=req.body.reason;
    if(!reason){
      res.status(HttpStatus.BAD_REQUEST).json({ error: Messages.CANCEL_ERROR});
    }
    const bookingId = req.params.bookingId;

    const result=await this._cancelDoctorBookingUseCase.execute(doctorId, bookingId, reason);
    
    if (!result.success) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: result.message });
      return;
    }
    res.status(HttpStatus.OK).json({ message: Messages.BOOKING_CANCELLED});
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
}

async getAllDepartments(_: Request, res: Response): Promise<void> {
  try {
    const departments = await this._getAllDepartmentsUseCase.execute();
    res.status(HttpStatus.OK).json(departments);
  } catch (error: any) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message:  Messages.INTERNAL_SERVER_ERROR});
  }
}

async getWalletSummary(req: AuthRequest, res: Response): Promise<void> {
  try {
    const doctorId = req.user?.userId;
    if (!doctorId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED });
      return;
    }


    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const summary = await this._getDoctorWalletSummaryUseCase.execute(doctorId, page, limit);

    res.status(HttpStatus.OK).json(summary);
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
}


async completeProfile(req: Request, res: Response): Promise<void> {
  try {
    const doctorId = req.params.doctorId;
    if (!doctorId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED });
      return;
    }


    const profileData = req.body;
    const updatedProfile = await this._completeProfileUseCase.execute(doctorId, profileData);

    res.status(HttpStatus.OK).json({ message:  Messages.PROFILE_COMPLETED, profile: updatedProfile });
  } catch (err: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
  }
}

async getBookingDetails(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const bookingId = req.params.bookingId;

    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED });
      return;
    }

    const booking = await this._getBookingDetailsDoctorUseCase.execute(bookingId, userId);
    res.status(HttpStatus.OK).json(booking);
  } catch (err: any) {
    const status = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    res.status(status).json({ error: err.message });
  }
}



}