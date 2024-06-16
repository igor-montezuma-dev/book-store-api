import express from "express";
import {
  login,
  register,
  registerAdmin,
  resetPassword,
  sendEmail,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/user-register", register);

router.post("/login", login);

router.post("/admin-register", registerAdmin);

router.post("/send-email", sendEmail);

router.post("/reset-password", resetPassword);

export default router;
