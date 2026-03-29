import Review from "../models/Review.js";

// Add Review
export const addReview = async (req, res) => {
  try {
    const { lawyerId, rating, comment } = req.body;

    const review = await Review.create({
      user: req.user._id,
      lawyer: lawyerId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Reviews for Lawyer
export const getLawyerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ lawyer: req.params.lawyerId })
      .populate("user", "name");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};