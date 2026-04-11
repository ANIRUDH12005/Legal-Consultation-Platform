import express from "express";
import {
  bookAppointment,
  getUserAppointments,
  getLawyerAppointments,
  updateAppointmentStatus,
  getAppointmentById,
} from "../controllers/appointmentController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// User books appointment
router.post("/", protect, authorizeRoles("user"), bookAppointment);

// User view own appointments
router.get("/user", protect, authorizeRoles("user"), getUserAppointments);

// Lawyer view appointments
router.get("/lawyer", protect, authorizeRoles("lawyer"), getLawyerAppointments);

// ✅ Lawyer updates status
router.put("/:id", protect, authorizeRoles("lawyer"), updateAppointmentStatus);

// ✅ Get single appointment (protected)
router.get("/:id", protect, getAppointmentById);

export default router;