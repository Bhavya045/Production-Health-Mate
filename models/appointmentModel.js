const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true, // Use true instead of just true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Use true instead of just true
  },
  date: {
    type: Date,
    required: true, // Use true instead of just true
  },
  time: {
    type: String,
    required: true, // Use true instead of just true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed'],
    default: 'pending',
  },
});

const appointmentModel = mongoose.model("appointments", appointmentSchema);
module.exports = appointmentModel;