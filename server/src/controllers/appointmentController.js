import Appointment from "../models/Appointment.js";

// Book Appointment
export const bookAppointment = async (req, res) => {
  try {
    const { lawyerId, date, time } = req.body;

    const appointment = await Appointment.create({
      user: req.user._id,
      lawyer: lawyerId,
      date,
      time,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Appointments
export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate("lawyer")
      .populate("user", "name email");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Lawyer Appointments
export const getLawyerAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("user", "name email")
      .populate("lawyer");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ NEW: Update Appointment Status (LAWYER ONLY)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;

    const updatedAppointment = await appointment.save();

    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};