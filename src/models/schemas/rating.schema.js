const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: false },
  publicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Publication", required: true },
  score: { type: Number, min: 1, max: 10, required: true },
  comment: { type: String, required: true },
  type: { type: String, enum: ["TEACHER_TO_SCHOOL", "STAFF_TO_TEACHER"], required: true },
}, { timestamps: true });

ratingSchema.index({ teacherId: 1, schoolId: 1, publicationId: 1, type: 1 }, { unique: true });

module.exports = ratingSchema;