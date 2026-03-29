import express from "express";
import { createLawyerProfile, getAllLawyers } from "../controllers/lawyerController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only lawyers can create profile
router.post("/", protect, authorizeRoles("lawyer"), createLawyerProfile);

// Public route
router.get("/", getAllLawyers);

export default router;