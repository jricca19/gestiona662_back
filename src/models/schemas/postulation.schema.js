const mongoose = require("mongoose");

const postulationDaySchema = new mongoose.Schema({
    date: { type: Date, required: true }
}, { _id: false });

const postulationSchema = new mongoose.Schema({
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    publicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Publication", required: true, },
    status: { type: String, enum: ["PENDING", "ACCEPTED", "REJECTED", "CANCELED"], default: "PENDING" },
    appliesToAllDays: { type: Boolean, default: true },
    postulationDays: [postulationDaySchema]
}, { timestamps: true });

postulationSchema.index({ publicationId: 1 });
postulationSchema.index({ teacherId: 1 });
postulationSchema.index({ teacherId: 1, publicationId: 1 }, { unique: true });

module.exports = postulationSchema;