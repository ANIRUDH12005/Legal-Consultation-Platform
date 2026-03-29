import Lawyer from "../models/Lawyer.js";

// Create Lawyer Profile
export const createLawyerProfile = async (req, res) => {
  try {
    const { specialization, experience, fees, location, bio } = req.body;

    const lawyer = await Lawyer.create({
      user: req.user._id,
      specialization,
      experience,
      fees,
      location,
      bio,
    });

    res.status(201).json(lawyer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Lawyers
import Review from "../models/Review.js";

export const getAllLawyers = async (req, res) => {
  try {
    const lawyers = await Lawyer.find().populate("user", "name email");

    const lawyersWithRatings = await Promise.all(
      lawyers.map(async (lawyer) => {
        const reviews = await Review.find({ lawyer: lawyer._id });

        const avgRating =
          reviews.reduce((acc, item) => acc + item.rating, 0) /
          (reviews.length || 1);

        return {
          ...lawyer._doc,
          avgRating,
          totalReviews: reviews.length,
        };
      })
    );

    res.json(lawyersWithRatings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};