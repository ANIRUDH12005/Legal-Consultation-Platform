import User from "../models/User.js";
import Lawyer from "../models/Lawyer.js";
import Appointment from "../models/Appointment.js";

// Admin Dashboard
export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalLawyers = await Lawyer.countDocuments();
    const totalAppointments = await Appointment.countDocuments();

    const acceptedAppointments = await Appointment.find({ status: "accepted" });

    const totalRevenue = acceptedAppointments.reduce(
      (acc, item) => acc + item.fees,
      0
    );

    res.json({
      totalUsers,
      totalLawyers,
      totalAppointments,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lawyer Dashboard
export const getLawyerDashboard = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      status: "accepted",
    }).populate("lawyer");

    const myAppointments = appointments.filter(
      (a) => a.lawyer.user.toString() === req.user._id.toString()
    );

    const totalEarnings = myAppointments.reduce(
      (acc, item) => acc + item.fees,
      0
    );

    res.json({
      totalAppointments: myAppointments.length,
      totalEarnings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};