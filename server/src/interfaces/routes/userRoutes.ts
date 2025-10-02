
import upload from '../middleware/upload';
import express, { Request, Response } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { userController, userAuthController } from "../../di/userDI"; 

const router = express.Router();

router.get("/refresh-token", (req: Request, res: Response) => userAuthController.refreshToken(req, res));
router.post("/register", (req: Request, res: Response) => userController.register(req, res));
router.post("/send-otp", (req: Request, res: Response) => userController.sendOtp(req, res));
router.post("/login", (req: Request, res: Response) => userController.login(req, res));
router.post("/google-login", (req: Request, res: Response) => userController.googleLogin(req, res));
router.post("/send-reset-otp", (req: Request, res: Response) => userController.sendResetOtpHandler(req, res));
router.post("/reset-password", (req: Request, res: Response) => userController.resetPasswordHandler(req, res));
router.get("/get-all-doctors", (req: Request, res: Response) => userController.getAllDoctors(req, res));
router.get("/doctor/:id", (req: Request, res: Response) => userController.getDoctorById(req, res));
router.post("/create-checkout-session", (req: Request, res: Response) => userController.createCheckoutSession(req, res));
router.get("/doctor/:doctorId/availability-rules",(req: Request, res: Response) => userController.getDoctorAvailabilityRules(req, res));
router.get(
  "/doctor/:doctorId/availability-exceptions",
  (req: Request, res: Response) => userController.getDoctorAvailabilityExceptions(req, res)
);

router.get("/booked-slots/:doctorId", (req: Request, res: Response) => userController.getBookedSlots(req, res));
router.get("/user/profile", verifyToken("user"), (req, res) => userController.getUserProfile(req, res));
router.get("/user/bookings", verifyToken("user"), (req: Request, res: Response) => userController.getUserBookings(req, res));
router.post("/user/bookings/:id/cancel", verifyToken("user"), (req: Request, res: Response) => userController.cancelBooking(req, res));
router.get("/departments", verifyToken("user"), (req: Request, res: Response) => userController.getDepartments(req, res));
router.get("/user/wallet", verifyToken("user"), (req: Request, res: Response) => userController.getWalletInfo(req, res));
router.post("/book-with-wallet", verifyToken("user"), (req: Request, res: Response) => userController.bookWithWallet(req, res));
router.get("/doctors/filter", (req: Request, res: Response) => userController.getFilteredDoctors(req, res));
router.get("/user/bookings/:id", verifyToken("user"), (req: Request, res: Response) => userController.getBookingDetails(req, res));
router.post("/logout", verifyToken("user"), (req: Request, res: Response) => userController.logoutUserController(req, res));
router.put("/update-profile",verifyToken("user"),upload.single("file"),(req, res) => userController.updateUserProfile(req, res));


export default router;
