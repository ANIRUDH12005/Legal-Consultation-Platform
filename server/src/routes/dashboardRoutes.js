import express from "express";
import {
  getAdminDashboard,
  getLawyerDashboard,
} from "../controllers/dashboardController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin dashboard
router.get("/admin", protect, authorizeRoles("admin"), getAdminDashboard);

// Lawyer dashboard
router.get("/lawyer", protect, authorizeRoles("lawyer"), getLawyerDashboard);

export default router;