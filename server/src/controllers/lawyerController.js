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
export const getAllLawyers = async (req, res) => {
  try {
    const lawyers = await Lawyer.find().populate("user", "name email");
    res.json(lawyers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};