import { Request, Response } from "express";
import { Messages } from "../../utils/Messages";
import { HttpStatus } from "../../utils/HttpStatus";
import { DoctorRegisterDTO } from "../dto/request/doctor-register.dto."
import { AuthRequest } from "../middleware/authMiddleware";

import { ISendDoctorOtp } from "../../application/use_cases/interfaces/doctor/ISendDoctorOtp";
import { IVerifyDoctorOtp } from "../../application/use_cases/interfaces/doctor/IVerifyDoctorOtp";
import { IGetDoctorProfile } from "../../application/use_cases/interfaces/doctor/IGetDoctorProfile";
import { IUpdateDoctorProfile } from "../../application/use_cases/interfaces/doctor/IUpdateDoctorProfile";
import { IAddDoctorAvailabilityRule } from "../../application/use_cases/interfaces/doctor/IAddDoctorAvailability";
import { IGetDoctorAvailability } from "../../application/use_cases/interfaces/doctor/IGetDoctorAvailability";
import { IGetDoctorBookings } from "../../application/use_cases/interfaces/doctor/IGetDoctorBookings";
import { IRemoveDoctorSlot } from "../../application/use_cases/interfaces/doctor/IRemoveDoctorSlot";
import { ICancelDoctorBooking } from "../../application/use_cases/interfaces/doctor/ICancelDoctorBooking";
import { IGetAllDepartmentsUseCase } from "../../application/use_cases/interfaces/doctor/IGetAllDepartmentsUseCase";
import { IGetDoctorWalletSummary } from "../../application/use_cases/interfaces/doctor/IGetDoctorWalletSummary";
import { ICompleteDoctorProfile } from "../../application/use_cases/interfaces/doctor/ICompleteDoctorProfile";
import { IGetBookingDetails } from "../../application/use_cases/interfaces/user/IGetBookingDetails";
import { IDoctorLogin } from "../../application/use_cases/interfaces/doctor/IDoctorLogin";


import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { IAddDoctorAvailabilityException } from "../../application/use_cases/interfaces/doctor/IAddDoctorAvailabilityException";
import { IGetDoctorAvailabilityExceptions } from "../../application/use_cases/interfaces/doctor/IGetDoctorAvailabilityExceptions";
import { IDeleteDoctorAvailabilityExceptionUseCase } from "../../application/use_cases/interfaces/doctor/IDeleteDoctorAvailabilityExceptionUseCase";
import { IEditDoctorAvailabilityRule } from "../../application/use_cases/interfaces/doctor/IEditDoctorAvailabilityRuleUseCase";
import { IDeleteDoctorAvailabilityRuleUseCase } from "../../application/use_cases/interfaces/doctor/IDeleteDoctorAvailabilityRuleUseCase";


 export interface MulterRequest extends Request {
  files?: {
    [fieldname: string]: Express.Multer.File[]; 
  };
}


export class DoctorController {


  constructor(
      private _sendDoctorOtp: ISendDoctorOtp,
      private _verifyDoctorOtp: IVerifyDoctorOtp, 
      private _loginUseCase: IDoctorLogin,
      private _getDoctorProfileUseCase: IGetDoctorProfile,
      private _updateDoctorProfileUseCase: IUpdateDoctorProfile,
      private _addAvailabilityUseCase: IAddDoctorAvailabilityRule,
      private _getAvailabilityUseCase: IGetDoctorAvailability,
      private _getDoctorBookingsUseCase: IGetDoctorBookings,
      private _removeDoctorSlotUseCase:IRemoveDoctorSlot,
      private _cancelDoctorBookingUseCase: ICancelDoctorBooking,
      private _getAllDepartmentsUseCase: IGetAllDepartmentsUseCase,
      private _getDoctorWalletSummaryUseCase: IGetDoctorWalletSummary,
      private _completeProfileUseCase: ICompleteDoctorProfile,
      private _getBookingDetailsDoctorUseCase: IGetBookingDetails,
      private _addDoctorAvailabilityExceptionUsecase: IAddDoctorAvailabilityException,
      private _getDoctorAvailabilityExceptionsUseCase: IGetDoctorAvailabilityExceptions,
      private _deleteDoctorAvailabilityExceptionUseCase: IDeleteDoctorAvailabilityExceptionUseCase,
      private _editAvailabilityRuleUseCase: IEditDoctorAvailabilityRule,
      private _deleteAvailabilityRuleUseCase: IDeleteDoctorAvailabilityRuleUseCase,
  ) {}

  async sendOtp(req: MulterRequest, res: Response): Promise<void> {
    try {
      const profileImage = req.files?.profileImage?.[0];
      const medicalLicense = req.files?.medicalLicense?.[0];
      const idProof = req.files?.idProof?.[0];

      const dto = plainToInstance(DoctorRegisterDTO,{
        ...req.body,
        profileImage: profileImage ? (profileImage as any).path : "",
        medicalLicense: medicalLicense ? (medicalLicense as any).path : "",
        idProof: idProof ? (idProof as any).path : ""
      });

      const errors = await validate(dto);
      if (errors.length > 0) {
        const formattedErrors = errors
          .map(err => Object.values(err.constraints || {}))
          .flat();

         res.status(HttpStatus.BAD_REQUEST).json({
          error: formattedErrors,
        });
      }
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

    const { accessToken, refreshToken, user} = await this._loginUseCase.execute(req.body);
    const accessTokenMaxAge= Number(process.env.ACCESS_TOKEN_COOKIE_MAXAGE);
    const refreshTokenMaxAge= Number(process.env.REFRESH_TOKEN_COOKIE_MAXAGE);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge:accessTokenMaxAge, 
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge:refreshTokenMaxAge, 
    });
    res.status(HttpStatus.OK).json({ message: Messages.LOGIN_SUCCESSFUL, user });
  } catch (err: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
  }
}


  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
     
      const doctorId = req.user?.id; 
      
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
      const doctorId = req.user?.id;

      if(!doctorId){
        res.status(HttpStatus.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED});
        return
      }

      const updatedProfile = await this._updateDoctorProfileUseCase.execute(doctorId, req.body);
      res.status(HttpStatus.OK).json(updatedProfile);
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  async addAvailabilityRule(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data= {...req.body, doctorId:req.user?.id }
      const result = await this._addAvailabilityUseCase.execute(data);
      res.status(HttpStatus.OK).json(result);
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

async fetchAvailabilityRule(req: AuthRequest, res: Response): Promise<void> {
  try {
    const doctorId = req.user?.id;
    if (!doctorId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED});
      return;
    }

    const availability = await this._getAvailabilityUseCase.execute(doctorId);
    res.status(HttpStatus.OK).json(availability);
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
}

async editAvailabilityRule(req: AuthRequest, res: Response) {
  try {
    const doctorId = req.user?.id;
    const dayOfWeek = Number(req.params.dayOfWeek);
    const dto = { ...req.body, dayOfWeek, doctorId };

    const updatedRule = await this._editAvailabilityRuleUseCase.execute( dto);
    res.status(HttpStatus.OK).json(updatedRule);
  } catch (err: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
  }
}


  async deleteAvailabilityRule(req: AuthRequest, res: Response) {
    try {
      const doctorId = req.user?.id;
      const dayOfWeek = Number(req.params.dayOfWeek);
      if(!doctorId){
        res.status(HttpStatus.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED });
        return;
      }
      
      const result = await this._deleteAvailabilityRuleUseCase.execute( { dayOfWeek, doctorId });
      res.status(HttpStatus.OK).json(result);
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

async addAvailabilityException(req: AuthRequest, res: Response): Promise<void> {
    try {
      
      const data = { ...req.body, doctorId: req.user?.id }; 

      const result = await this._addDoctorAvailabilityExceptionUsecase.execute(data);
      res.status(HttpStatus.CREATED).json(result);
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
}

async fetchAvailabilityExceptions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const doctorId = req.user?.id;
      if (!doctorId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.DOCTOR_ID_REQUIRED });
        return;
      }
       const dto ={ doctorId}
      const result = await this._getDoctorAvailabilityExceptionsUseCase.execute(dto);
      res.status(HttpStatus.OK).json(result);
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
}

async deleteAvailabilityException(req: AuthRequest, res: Response): Promise<void> {
  try {
    const doctorId  = req.user?.id; 
    const { exceptionId } = req.params; 

    if (!doctorId || !exceptionId) {
      res.status(400).json({ message: Messages.DOCTOR_ID_REQUIRED });
      return;
    }

    const dto = { doctorId, exceptionId }; 
    const result = await this._deleteDoctorAvailabilityExceptionUseCase.execute(dto);

    res.status(HttpStatus.OK).json(result);
  } catch (err: any) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: err.message });
  }
}



async getBookings(req: AuthRequest, res: Response): Promise<void> {
  try {
    
    const doctorId = req.user?.id;
    
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

async cancelBooking(req: AuthRequest, res: Response): Promise<void> {
  try {
    const doctorId = req.user?.id;
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
    const doctorId = req.user?.id;
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
    const userId = req.user?.id;
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