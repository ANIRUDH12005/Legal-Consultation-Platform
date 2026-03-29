import express from "express";
import {
  getAllUsers,
  getAllLawyersAdmin,
  approveLawyer,
  rejectLawyer,
} from "../controllers/adminController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admin can access
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.get("/lawyers", protect, authorizeRoles("admin"), getAllLawyersAdmin);

router.put("/approve/:id", protect, authorizeRoles("admin"), approveLawyer);
router.put("/reject/:id", protect, authorizeRoles("admin"), rejectLawyer);

export default router;