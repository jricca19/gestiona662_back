const {
    getPublications,
    createPublication,
    findPublication,
    deletePublication,
    updatePublication,
    findDuplicatePublication,
    getPublicationsBySchoolId,
} = require("../repositories/publication.repository");
const { deletePostulationsByPublicationId } = require("../repositories/postulation.repository");
const { findSchoolById } = require("../repositories/school.repository");
const { findPostulation, updatePostulation } = require("../repositories/postulation.repository");
const { dateToIsoString, dateStringToUTC, todayStringInTZ } = require("../utils/dates");

const getPublicationsController = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, departmentName, schoolId, startDate } = req.query;

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        const filters = {};
        if (departmentName) filters.departmentName = departmentName;
        if (schoolId) filters.schoolId = schoolId;
        if (startDate) filters.startDate = startDate;

        const publications = await getPublications(filters);

        //TODO: usar limit y skip a nivel de base de datos para mejorar el rendimiento

        // Calculate indexes
        const startIndex = (pageNumber - 1) * limitNumber;
        const endIndex = pageNumber * limitNumber;

        // Paginate the publications
        const paginatedPublications = publications.slice(startIndex, endIndex);
        const total = publications.length;

        return res.status(200).json({ total: total, page: pageNumber, limit: limitNumber, publications: paginatedPublications });
    } catch (error) {
        next(error);
    }
};

const getPublicationController = async (req, res, next) => {
    try {
        const publicationId = req.params.id;
        const publication = await findPublication(publicationId);
        if (publication) {
            return res.status(200).json(publication);
        }
        return res.status(404).json({ message: `No se ha encontrado la publicación con id: ${publicationId}`, });
    } catch (error) {
        next(error);
    }
};

const getPublicationsOfSchoolController = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const schoolId = req.params.id;

        const school = await findSchoolById(schoolId);
        if (!school) {
            return res.status(404).json({ message: `No se ha encontrado la escuela con id: ${schoolId}` });
        }

        const isUserInSchool = school.staff?.some(staff => staff.userId.toString() === _id.toString());
        if (!isUserInSchool) {
            return res.status(403).json({ message: "No tiene permiso para ver las publicaciones de esta escuela." });
        }

        const publications = await getPublicationsBySchoolId(schoolId);
        return res.status(200).json(publications);
    } catch (error) {
        next(error);
    }
};

const generatePublicationDays = (start, end) => {
    const days = [];
    const d = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
    for (; d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
        const weekday = d.getUTCDay();
        if (weekday >= 1 && weekday <= 5) {
            days.push({
                date: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())),
                assignedTeacherId: null,
                status: "AVAILABLE"
            });
        }
    }
    return days;
};

const postPublicationController = async (req, res, next) => {
    try {
        const { schoolId, grade, startDate, endDate, shift, details, isType662 = false } = req.body;
        const { _id } = req.user;

        const start = dateStringToUTC(startDate);
        const end = dateStringToUTC(endDate);

        if (endDate < startDate) {
            return res.status(400).json({ message: "La fecha de fin debe ser mayor o igual a la fecha de inicio." });
        }

        const hoy = todayStringInTZ('America/Montevideo');
        if (startDate < hoy) {
            return res.status(400).json({ message: "La fecha de inicio no puede ser anterior a hoy." });
        }

        if ([start.getUTCDay(), end.getUTCDay()].some(d => d === 0 || d === 6)) {
            return res.status(400).json({ message: "La fecha de inicio o fin no puede ser un fin de semana." });
        }

        const school = await findSchoolById(schoolId);
        if (!school) {
            return res.status(404).json({ message: `No se ha encontrado la escuela con id: ${schoolId}`, });
        }

        const isUserInSchool = school.staff?.some(staff => staff.userId.toString() === _id.toString());
        if (!isUserInSchool) {
            return res.status(403).json({ message: "No tiene permiso para crear publicaciones para esta escuela." });
        }

        const duplicated = await findDuplicatePublication(
            schoolId,
            grade,
            shift,
            start,
            end
        );
        if (duplicated) {
            return res.status(400).json({ message: "Ya existe una publicación abierta para esa escuela, grado, turno y rango de fechas.", });
        }

        const publicationDays = generatePublicationDays(start, end);
        const workingCount = publicationDays.length;

        if (workingCount === 0) {
            return res.status(400).json({ message: "El rango de fechas no contiene días hábiles (lunes a viernes)." });
        }
        if (isType662 && workingCount > 3) {
            return res.status(400).json({ message: "No se pueden crear publicaciones para más de 3 días hábiles en suplencias tipo 662." });
        }
        if (!isType662 && workingCount > 30) {
            return res.status(400).json({ message: "No se pueden crear publicaciones para más de 30 días hábiles en suplencias generales." });
        }

        await createPublication(schoolId, grade, start, end, shift, isType662, publicationDays, details);
        return res.status(201).json({ message: "Publicación creada correctamente", });
    } catch (error) {
        next(error);
    }
};

const deletePublicationController = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const publicationId = req.params.id;
        const publication = await findPublication(publicationId);

        if (!publication) {
            return res.status(404).json({ message: `No se ha encontrado la publicación con id: ${publicationId}` });
        }

        const hasActivePublication = ["OPEN", "FILLED"].includes(publication.status) &&
            publication.publicationDays?.some(day => day.assignedTeacherId !== null);

        if (hasActivePublication) {
            return res.status(400).json({ message: "No se puede eliminar una publicación activa que ya tiene personas asignadas" });
        }

        const school = await findSchoolById(publication.schoolId);
        const isUserInSchool = school.staff?.some(staff => staff.userId.toString() === _id.toString());
        if (!isUserInSchool) {
            return res.status(403).json({ message: "No tiene permiso para eliminar esta publicación." });
        }

        await deletePostulationsByPublicationId(publicationId);
        await deletePublication(publicationId);
        return res.status(200).json({ message: "Publicación eliminada correctamente" });
    } catch (error) {
        next(error);
    }
};

const assignPostulationController = async (req, res, next) => {
    try {
        const asignaciones = req.body?.asignaciones;
        if (!Array.isArray(asignaciones) || asignaciones.length === 0) {
            return res.status(400).json({ message: "No se proporcionaron asignaciones válidas." });
        }

        const postulationIds = asignaciones.map(a => a.postulationId);
        const postulations = await Promise.all(postulationIds.map(id => findPostulation(id)));
        for (let i = 0; i < postulations.length; i++) {
            if (!postulations[i]) {
                return res.status(404).json({ message: `No se encontró postulación ${postulationIds[i]}` });
            }
        }
        const publicationId = postulations[0].publicationId.toString();
        const allSame = postulations.every(p => p.publicationId.toString() === publicationId);
        if (!allSame) {
            return res.status(400).json({ message: "Todas las asignaciones deben pertenecer a la misma publicación." });
        }

        const publication = await findPublication(publicationId);
        if (!publication) {
            return res.status(404).json({ message: `No se encontró publicación ${publicationId}` });
        }
        if (publication.status === "FILLED") {
            return res.status(400).json({ message: "Selección de postulantes ya realizada para esta publicación." });
        }

        const dayTeacherMap = new Map();
        for (const asignacion of asignaciones) {
            const postulation = postulations.find(p => p._id.toString() === asignacion.postulationId);
            const teacherId = postulation.teacherId;
            const selectedDayStrings = (asignacion.selectedDays || [])
                .map(d => dateToIsoString(new Date(d)));
            for (const dayStr of selectedDayStrings) {
                if (!dayTeacherMap.has(dayStr)) {
                    dayTeacherMap.set(dayStr, teacherId);
                }
            }
        }

        const publicationDayStrings = publication.publicationDays.map(d => dateToIsoString(d.date));
        const missingDays = publicationDayStrings.filter(d => !dayTeacherMap.has(d));
        if (missingDays.length > 0) {
            return res.status(400).json({
                message: "Faltan asignaciones para los días: " + missingDays.join(", "),
            });
        }

        publication.publicationDays = publication.publicationDays.map(day => {
            const pubDayStr = dateToIsoString(day.date);
            if (dayTeacherMap.has(pubDayStr)) {
                return {
                    ...day,
                    assignedTeacherId: dayTeacherMap.get(pubDayStr),
                    status: "ASSIGNED",
                };
            }
            return day;
        });

        await Promise.all(postulations.map(p => updatePostulation(p._id, { status: "ACCEPTED" })));

        await updatePublication(publicationId, {
            publicationDays: publication.publicationDays,
            status: "FILLED",
        });

        return res.status(200).json({ message: "Postulaciones asignadas correctamente." });
    } catch (error) {
        console.error("Error en asignación múltiple:", error);
        next(error);
    }
};

const putPublicationController = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const publicationId = req.params.id;
        const { body } = req;
        const { schoolId, grade, startDate, endDate, shift } = body;
        const publication = await findPublication(publicationId);

        if (!publication) {
            return res.status(404).json({ message: `No se ha encontrado la publicación con id: ${publicationId}`, });
        }

        const hasActivePublication = ["OPEN", "FILLED"].includes(publication.status) &&
            publication.publicationDays?.some(day => day.assignedTeacherId !== null);

        if (hasActivePublication) {
            return res.status(400).json({ message: "No se puede modificar una publicación activa que ya tiene personas asignadas." });
        }

        const school = await findSchoolById(publication.schoolId);
        const isUserInSchool = school.staff?.some(staff => staff.userId.toString() === _id.toString());
        if (!isUserInSchool) {
            return res.status(403).json({ message: "No tiene permiso para modificar esta publicación." });
        }

        if (body.startDate && body.endDate) {
            const start = dateStringToUTC(body.startDate);
            const end = dateStringToUTC(body.endDate);
            if (end <= start) {
                return res.status(400).json({ message: `La fecha de fin debe ser mayor o igual a la fecha de inicio`, });
            }
        }

        const dupStart = startDate ? dateStringToUTC(startDate) : publication.startDate;
        const dupEnd = endDate ? dateStringToUTC(endDate) : publication.endDate;

        const duplicated = await findDuplicatePublication(
            schoolId,
            grade,
            shift,
            dupStart,
            dupEnd
        );
        if (duplicated) {
            return res.status(400).json({ message: "Ya existe una publicación abierta para esa escuela, grado, turno y rango de fechas.", });
        }

        const effectiveStart = dupStart;
        const effectiveEnd = dupEnd;
        const effectiveType662 = (typeof body.isType662 === "boolean") ? body.isType662 : !!publication.isType662;

        const publicationDays = generatePublicationDays(effectiveStart, effectiveEnd);
        const workingCount = publicationDays.length;

        if (workingCount === 0) {
            return res.status(400).json({ message: "El rango de fechas no contiene días hábiles (lunes a viernes)." });
        }
        if (effectiveType662 && workingCount > 3) {
            return res.status(400).json({ message: "Para suplencias tipo 662 el rango no puede exceder 3 días hábiles (lunes a viernes)." });
        }
        if (!effectiveType662 && workingCount > 30) {
            return res.status(400).json({ message: "Para suplencias no 662 el rango no puede exceder 30 días hábiles (lunes a viernes)." });
        }

        if (body.startDate || body.endDate) {
            if (body.startDate) body.startDate = dateStringToUTC(body.startDate);
            if (body.endDate) body.endDate = dateStringToUTC(body.endDate);
            body.publicationDays = generatePublicationDays(body.startDate || publication.startDate, body.endDate || publication.endDate);
        }

        await updatePublication(publicationId, body);
        return res.status(200).json({ message: "Publicación actualizada correctamente", });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPublicationsController,
    getPublicationController,
    getPublicationsOfSchoolController,
    assignPostulationController,
    postPublicationController,
    putPublicationController,
    deletePublicationController,
};