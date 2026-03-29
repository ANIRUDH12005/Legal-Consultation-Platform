import User from "../models/User.js";
import Lawyer from "../models/Lawyer.js";

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Lawyers
export const getAllLawyersAdmin = async (req, res) => {
  try {
    const lawyers = await Lawyer.find().populate("user", "name email");
    res.json(lawyers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve Lawyer
export const approveLawyer = async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id);

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    lawyer.isApproved = true;

    const updated = await lawyer.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject Lawyer
export const rejectLawyer = async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id);

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    lawyer.isApproved = false;

    const updated = await lawyer.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};