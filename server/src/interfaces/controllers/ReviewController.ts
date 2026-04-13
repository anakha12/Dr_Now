import { Request, Response } from "express";
import { handleControllerError } from "../../utils/errorHandler";
import { HttpStatus } from "../../utils/HttpStatus";
import { CreateReviewUseCase } from "../../application/use_cases/reviews/createReview";
import { GetDoctorReviewsUseCase } from "../../application/use_cases/reviews/getDoctorReviews";
import { GetDoctorRatingUseCase } from "../../application/use_cases/reviews/getDoctorRating";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class ReviewController {
  constructor(
    private _createReviewUseCase: CreateReviewUseCase,
    private _getDoctorReviewsUseCase: GetDoctorReviewsUseCase,
    private _getDoctorRatingUseCase: GetDoctorRatingUseCase
  ) {}

  async createReview(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const reviewData = req.body;
      const review = await this._createReviewUseCase.execute(reviewData);
      res.status(HttpStatus.CREATED).json(review);
    } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.BAD_REQUEST);
    }
  }

  async getDoctorReviews(req: Request, res: Response): Promise<void> {
    try {
      const { doctorId } = req.params;
      const reviews = await this._getDoctorReviewsUseCase.execute(doctorId);
      res.status(HttpStatus.OK).json(reviews);
    } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.BAD_REQUEST);
    }
  }

  async getDoctorRating(req: Request, res: Response): Promise<void> {
    try {
      const { doctorId } = req.params;
      const rating = await this._getDoctorRatingUseCase.execute(doctorId);
      res.status(HttpStatus.OK).json(rating);
    } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.BAD_REQUEST);
    }
  }
}
