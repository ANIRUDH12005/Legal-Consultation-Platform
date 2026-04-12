import express from "express";
import { createLawyerProfile, getAllLawyers, getLawyerById } from "../controllers/lawyerController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only lawyers can create profile
router.post("/", protect, authorizeRoles("lawyer"), createLawyerProfile);

// Public routes
router.get("/", getAllLawyers);
router.get("/:id", getLawyerById);

export default router;