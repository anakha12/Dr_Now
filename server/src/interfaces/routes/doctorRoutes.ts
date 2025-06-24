import express from "express";
import { DoctorController,MulterRequest } from "../controllers/doctorController";
import multer from 'multer';
import { upload } from "../../interfaces/middleware/multerConfig";
import { cookieAuth } from "../../interfaces/middleware/cookieAuth";


const router = express.Router();
const doctorController = new DoctorController();


router.post(
  "/send-otp",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "medicalLicense", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
  ]),
  (req, res) => doctorController.sendOtp(req as MulterRequest, res)
);

router.post("/verify-otp", (req, res) => doctorController.verifyOtp(req, res));
router.post("/login", (req, res) => doctorController.login(req, res));
router.get("/profile", cookieAuth("doctor"), (req, res) => doctorController.getProfile(req, res));
router.put("/profile", cookieAuth("doctor"), (req, res) => doctorController.updateProfile(req, res));
router.post("/doctors/:doctorId/availability",cookieAuth("doctor"), (req, res) => doctorController.addAvailability(req, res));
router.get("/doctors/:doctorId/availability",cookieAuth("doctor"),(req, res) => doctorController.fetchAvailability(req, res));
router.delete("/doctors/:doctorId/availability",cookieAuth("doctor"),(req, res) => doctorController.removeAvailabilitySlot(req, res));
router.get("/bookings", cookieAuth("doctor"), (req, res) =>doctorController.getBookings(req, res));
router.put("/doctors/:doctorId/availability",cookieAuth("doctor"),(req, res) => doctorController.editAvailability(req, res));

router.put("/bookings/:bookingId/cancel", cookieAuth("doctor"), (req, res) =>doctorController.cancelBooking(req, res));
export default router;