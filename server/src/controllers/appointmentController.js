import Appointment from "../models/Appointment.js";

// Book Appointment
import Lawyer from "../models/Lawyer.js";

export const bookAppointment = async (req, res) => {
  try {
    const { lawyerId, date, time } = req.body;

    const lawyer = await Lawyer.findById(lawyerId);

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      lawyer: lawyerId,
      date,
      time,
      fees: lawyer.fees, //  store fees
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
      .populate({
        path: "lawyer",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Lawyer Appointments
export const getLawyerAppointments = async (req, res) => {
  try {
    // Find the lawyer profile for the current user
    const lawyer = await Lawyer.findOne({ user: req.user._id });

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer profile not found" });
    }

    const appointments = await Appointment.find({ lawyer: lawyer._id })
      .populate("user", "name email")
      .populate({
        path: "lawyer",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  NEW: Update Appointment Status (LAWYER ONLY)
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

// Get single appointment (for video call verification)
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("user", "name email")
      .populate({
        path: "lawyer",
        populate: {
          path: "user",
          select: "name email",
        },
      });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Security: Only the user or the lawyer involved can view it
    const isUser = appointment.user._id.toString() === req.user._id.toString();
    const isLawyer = appointment.lawyer.user._id.toString() === req.user._id.toString();

    if (!isUser && !isLawyer && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to view this appointment" });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};