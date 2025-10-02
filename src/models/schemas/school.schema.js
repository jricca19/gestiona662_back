const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    role: { type: String, enum: ["PRIMARY", "SECONDARY"], required: true },
    isApproved: { type: Boolean, default: false },
    assignedAt: { type: Date, required: true }
});

const schoolSchema = new mongoose.Schema({
    schoolNumber: { type: Number, required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    cityName: { type: String, required: true },
    address: { type: String, required: true },
    haveRating: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    staff: [staffSchema]
}, { timestamps: true });

schoolSchema.index({ schoolNumber: 1, departmentId: 1, cityName: 1 }, { unique: true });

module.exports = schoolSchema;