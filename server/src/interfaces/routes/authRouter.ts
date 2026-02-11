import express from "express";
import { userAuthController } from "../../di/userDI";

const router = express.Router();


router.get("/refresh-token", (req, res) => userAuthController.refreshToken(req, res));

export default router;
