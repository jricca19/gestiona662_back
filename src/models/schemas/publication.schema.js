const mongoose = require("mongoose");

const publicationDaySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  assignedTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false, },
  status: { type: String, enum: ["AVAILABLE", "ASSIGNED", "CANCELLED", "EXPIRED", "COMPLETED"], required: true }
}, { _id: false });

const publicationSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true, },
  grade: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  shift: { type: String, enum: ["MORNING", "AFTERNOON", "FULL_DAY"], required: true },
  details: { type: String, required: false },
  status: { type: String, enum: ["OPEN", "FILLED", "CANCELLED", "EXPIRED", "COMPLETED"], default: "OPEN" },
  publicationDays: [publicationDaySchema]
}, { timestamps: true });

module.exports = publicationSchema;
