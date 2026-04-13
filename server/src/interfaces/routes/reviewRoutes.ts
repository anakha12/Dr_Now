import express, { Request, Response } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { reviewController } from "../../di/review.di";
import { Role } from '../../utils/Constance';

const router = express.Router();

// Public routes (anyone can see reviews)
router.get("/doctor/:doctorId", (req: Request, res: Response) => reviewController.getDoctorReviews(req, res));
router.get("/doctor/:doctorId/rating", (req: Request, res: Response) => reviewController.getDoctorRating(req, res));

// Private routes (only authenticated patients can review)
router.post("/", verifyToken(Role.USER), (req: Request, res: Response) => reviewController.createReview(req, res));

export default router;
