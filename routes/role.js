import express from "express";
import {
  createRole,
  deleteRole,
  getAllRoles,
  updateRole,
} from "../controllers/role.controller.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/get-all", getAllRoles);
router.post("/create-role", verifyAdmin, createRole);
router.put("/update-role/:id", verifyAdmin, updateRole);
router.delete("/delete-role/:id", verifyAdmin, deleteRole);

export default router;
