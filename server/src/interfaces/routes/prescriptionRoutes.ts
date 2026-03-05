import express from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { Role } from "../../utils/Constance";
import { prescriptionController } from "../../di/prescriptionDI";

const router = express.Router();


router.patch(
  "/bookings/:bookingId/prescription",
  verifyToken(Role.DOCTOR),
  (req, res) => prescriptionController.addPrescription(req, res)
);

export default router;