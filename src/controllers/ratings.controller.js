const {
    createRating,
    findRatingById,
    findDuplicateRating,
    deleteRating,
    getRatingsByType
} = require("../repositories/rating.repository");
const { findSchoolById } = require("../repositories/school.repository");
const { findUserByIdWhithCache } = require("../repositories/user.repository");
const { findPublication, isTeacherInPublicationDays } = require("../repositories/publication.repository");

const getRatingsByUserController = async (req, res, next) => {
    try {
        const { teacherId, schoolId } = req.body;
        const { _id } = req.user;

        if (teacherId) {
            const teacher = await findUserByIdWhithCache(teacherId);
            if (!teacher) {
                return res.status(404).json({ message: `No se ha encontrado el maestro con id: ${teacherId}` });
            }
            if (teacherId.toString() !== _id.toString()) {
                return res.status(403).json({ message: "No tienes permiso para ver las calificaciones de este maestro" });
            }
            const ratings = await getRatingsByType(teacherId, "teacher");
            return res.status(200).json(ratings);
        }

        if (schoolId) {

            const school = await findSchoolById(schoolId);
            if (!school) {
                return res.status(404).json({ message: `No se ha encontrado la escuela con id: ${schoolId}` });
            }

            const isStaffMember = school.staff?.some(staff => staff.userId.toString() === _id.toString());
            if (!isStaffMember) {
                return res.status(403).json({ message: "No tienes permiso para ver las calificaciones de esta escuela" });
            }

            const ratings = await getRatingsByType(schoolId, "school");
            return res.status(200).json(ratings);
        }

        res.status(400).json({ message: "Debes proporcionar un ID de maestro o escuela" });

    } catch (error) {
        next(error);
    }
};

const getRatingController = async (req, res, next) => {
    try {
        const ratingId = req.params.id;
        const { _id, role } = req.user;

        const rating = await findRatingById(ratingId);
        if (!rating) {
            return res.status(404).json({ message: `No se ha encontrado el rating con id: ${ratingId}` });
        }

        const { teacherId, schoolId, type } = rating;

        if (role === "STAFF") {
            const school = await findSchoolById(schoolId);
            if (!school) {
                return res.status(404).json({ message: `No se ha encontrado la escuela con id: ${schoolId}` });
            }

            const isStaffMember = school.staff?.some(staff => staff.userId.toString() === _id.toString());
            if (!isStaffMember) {
                return res.status(403).json({ message: "No tienes permiso para ver este rating" });
            }
        } else if (role === "TEACHER") {
            if (teacherId.toString() !== _id.toString()) {
                return res.status(403).json({ message: "No tienes permiso para ver este rating" });
            }
        }

        res.status(200).json(rating);

    } catch (error) {
        next(error);
    }
};

const postRatingController = async (req, res, next) => {
    try {
        const { publicationId, teacherId, score, comment } = req.body;
        const { _id, role } = req.user;

        let providedTeacherId = teacherId || null;
        let schoolId = null;
        let type;

        const publication = await findPublication(publicationId);
        if (!publication) {
            return res.status(404).json({ message: `No se ha encontrado la publicación con id: ${publicationId}` });
        }

        schoolId = publication.schoolId;
        const school = await findSchoolById(schoolId);

        if (role === "STAFF") {
            type = "STAFF_TO_TEACHER";

            const isStaffMember = school.staff?.some(staff => staff.userId.toString() === _id.toString());
            if (!isStaffMember) {
                return res.status(403).json({ message: "No tienes permiso para calificar a este maestro" });
            }

            if (!providedTeacherId) {
                return res.status(400).json({ message: "Debes proporcionar un ID de maestro para calificar" });
            }
        } else if (role === "TEACHER") {
            type = "TEACHER_TO_SCHOOL";
            providedTeacherId = _id;
        } else {
            return res.status(400).json({ message: "Rol de usuario inválido para realizar una calificación" });
        }

        const isTeacherValid = isTeacherInPublicationDays(publication, providedTeacherId);
        if (!isTeacherValid) {
            return res.status(400).json({ message: "El maestro proporcionado no está asignado a ningún día de esta publicación" });
        }

        const duplicatedRating = await findDuplicateRating(providedTeacherId, schoolId, publicationId, type);
        if (duplicatedRating) {
            return res.status(409).json({ message: "Ya existe un rating para este contexto" });
        }

        const rating = await createRating(providedTeacherId, schoolId, publicationId, score, comment, type);
        res.status(201).json({ message: "Rating creado correctamente", rating });
    } catch (error) {
        next(error);
    }
};

const deleteRatingController = async (req, res, next) => {
    try {
        const ratingId = req.params.id;
        const { _id, role } = req.user;

        const rating = await findRatingById(ratingId);
        if (!rating) {
            return res.status(404).json({ message: `No se ha encontrado el rating con id: ${ratingId}` });
        }

        const publication = await findPublication(rating.publicationId);
        if (!publication) {
            return res.status(404).json({ message: `No se ha encontrado la publicación asociada al rating` });
        }

        const school = await findSchoolById(publication.schoolId);

        if (role === "STAFF") {
            const isStaffMember = school.staff?.some(staff => staff.userId.toString() === _id.toString());
            if (!isStaffMember) {
                return res.status(403).json({ message: "No tienes permiso para eliminar este rating" });
            }
        } else if (role === "TEACHER") {
            if (publication.createdBy.toString() !== _id) {
                return res.status(403).json({ message: "No tienes permiso para eliminar este rating" });
            }
        } else {
            return res.status(403).json({ message: "Rol de usuario no autorizado para eliminar ratings" });
        }

        await deleteRating(ratingId);
        res.status(200).json({
            message: "Rating eliminado correctamente"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRatingController,
    postRatingController,
    deleteRatingController,
    getRatingsByUserController,
};