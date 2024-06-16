import express from "express";
import {
  login,
  register,
  registerAdmin,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/user-register", register);

router.post("/login", login);

router.post("/admin-register", registerAdmin);

export default router;
