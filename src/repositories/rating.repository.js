const mongoose = require("mongoose");
const Rating = require("../models/rating.model");

const getRatingsByType = async (id, type) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`ID inválido: ${id}`);
    }

    const filter = type === "teacher" ? { teacherId: id } : { schoolId: id };
    return await Rating.find(filter);
};

const findRatingById = async (ratingId) => {
    if (!mongoose.Types.ObjectId.isValid(ratingId)) {
        throw new Error(`No existe rating con ID: ${ratingId}`);
    }
    return await Rating.findById(ratingId);
};

const findDuplicateRating = async (teacherId, schoolId, publicationId, type) => {
    if (!mongoose.Types.ObjectId.isValid(teacherId) || !mongoose.Types.ObjectId.isValid(schoolId) || !mongoose.Types.ObjectId.isValid(publicationId)) {
        throw new Error(`ID inválido.`);
    }
    return await Rating.findOne({ teacherId, schoolId, publicationId, type }).select("_id");
};

const createRating = async (teacherId, schoolId, publicationId, score, comment, type) => {
    if (!mongoose.Types.ObjectId.isValid(teacherId) || !mongoose.Types.ObjectId.isValid(schoolId) || !mongoose.Types.ObjectId.isValid(publicationId)) {
        throw new Error(`ID inválido.`);
    }

    const newRating = new Rating({ teacherId, schoolId, publicationId, score, comment, type, });

    await newRating.save();
    return newRating;
};

const deleteRating = async (ratingId) => {
    if (!mongoose.Types.ObjectId.isValid(ratingId)) {
        throw new Error(`No existe rating con ID: ${ratingId}`);
    }
    return await Rating.deleteOne({ _id: ratingId });
};

const deleteRatingsBySchoolId = async (schoolId) => {
    await Rating.deleteMany({ schoolId, type: "TEACHER_TO_SCHOOL" });
}


module.exports = {
    findRatingById,
    findDuplicateRating,
    createRating,
    deleteRating,
    getRatingsByType,
    deleteRatingsBySchoolId
};