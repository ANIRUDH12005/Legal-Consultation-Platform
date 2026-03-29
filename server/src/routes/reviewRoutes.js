import express from "express";
import {
  addReview,
  getLawyerReviews,
} from "../controllers/reviewController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// User adds review
router.post("/", protect, authorizeRoles("user"), addReview);

// Get reviews for lawyer
router.get("/:lawyerId", getLawyerReviews);

export default router;