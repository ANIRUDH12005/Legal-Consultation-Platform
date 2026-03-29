import express from "express";
import {
  bookAppointment,
  getUserAppointments,
  getLawyerAppointments,
} from "../controllers/appointmentController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// User books appointment
router.post("/", protect, authorizeRoles("user"), bookAppointment);

// User view own appointments
router.get("/user", protect, authorizeRoles("user"), getUserAppointments);

// Lawyer view appointments
router.get("/lawyer", protect, authorizeRoles("lawyer"), getLawyerAppointments);

export default router;