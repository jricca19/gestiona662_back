const mongoose = require("mongoose");
const Publication = require("../models/publication.model");
const connectToRedis = require("../services/redis.service");
const { toLocalDate } = require("../utils/dates"); // usar parseo UTC

// Debug flag
const DEBUG_PUBLICATIONS = process.env.DEBUG_PUBLICATIONS === 'true';
const dbg = (...args) => { if (DEBUG_PUBLICATIONS) console.log(...args); };

const getPublications = async (filters = {}) => {
    const hasFilters = filters && Object.keys(filters).length > 0;
    dbg('[repo.getPublications] filters=', filters, 'hasFilters=', hasFilters);

    // if has filters, search directly in the database without cache
    if (hasFilters) {
        let query = { status: "OPEN" };

        if (filters.schoolId) {
            if (!mongoose.Types.ObjectId.isValid(filters.schoolId)) {
                throw new Error(`Escuela con ID ${filters.schoolId} inválido`);
            }
            query.schoolId = filters.schoolId;
        }

        if (filters.startDate) {
            // antes: new Date(filters.startDate) -> parseo local
            const start = toLocalDate(filters.startDate); // medianoche UTC
            query.startDate = { $gte: start };
            dbg('[repo.getPublications] normalized startDate >=', start.toISOString());
        }

        dbg('[repo.getPublications] query=', query);
        let publications = await Publication.find(query)
            .populate({
                path: "schoolId",
                select: "schoolId schoolNumber departmentId cityName address",
                populate: {
                    path: "departmentId",
                    select: "name",
                }
            })
            .select();

        dbg('[repo.getPublications] result count=', publications?.length);

        if (filters.departmentName) {
            publications = publications.filter(pub =>
                pub.schoolId?.departmentId?.name?.toLowerCase().includes(filters.departmentName.toLowerCase())
            );
            dbg('[repo.getPublications] filtered by departmentName, count=', publications?.length);
        }
        return publications;
    }

    // if not has filters, search in cache
    const redisClient = connectToRedis();
    let publications = await redisClient.get("publications");
    if (!publications) {
        dbg('[repo.getPublications] cache miss');
        publications = await Publication.find({ status: "OPEN" })
            .populate({
                path: "schoolId",
                select: "schoolId schoolNumber departmentId cityName address",
                populate: {
                    path: "departmentId",
                    select: "name",
                }
            })
            .select();
        await redisClient.set("publications", JSON.stringify(publications));
        dbg('[repo.getPublications] cached publications count=', publications?.length);
    } else {
        dbg('[repo.getPublications] cache hit');
    }
    return publications;
};

const getPublicationsBySchoolId = async (schoolId) => {
    return await Publication.find({ schoolId }).populate({
        path: "schoolId",
        select: "schoolId schoolNumber departmentId cityName address",
        populate: {
            path: "departmentId",
            select: "name",
        }
    }).select();
};

const createPublication = async (schoolId, grade, startDate, endDate, shift, isType662 = false, publicationDaysArg) => {
    if (!mongoose.Types.ObjectId.isValid(schoolId)) {
        throw new Error(`Escuela con ID ${schoolId} inválido`);
    }
    dbg('[repo.createPublication] payload=', {
        schoolId, grade, shift, isType662,
        startISO: new Date(startDate).toISOString?.(),
        endISO: new Date(endDate).toISOString?.(),
        daysProvided: Array.isArray(publicationDaysArg) ? publicationDaysArg.length : 'no'
    });

    const publicationDays = Array.isArray(publicationDaysArg)
        ? publicationDaysArg
        : await generatePublicationDays(startDate, endDate);

    const newPublication = new Publication({
        schoolId,
        grade,
        startDate,
        endDate,
        shift,
        isType662,
        status: "OPEN",
        publicationDays
    });
    const redisClient = connectToRedis();
    await redisClient.del("publications");
    await newPublication.save();
    dbg('[repo.createPublication] created _id=', newPublication._id?.toString(), 'days=', publicationDays.length);
    return newPublication;
};

// Regeneración de días en UTC
const generatePublicationDays = async (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
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
    dbg('[repo.generatePublicationDays] start=', start.toISOString(), 'end=', end.toISOString(), 'count=', days.length, 'first=', days[0]?.date?.toISOString(), 'last=', days[days.length-1]?.date?.toISOString());
    return days;
};

const findPublication = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`No existe ID: ${id}`);
    }
    return await Publication.findById(id).select("_id schoolId grade startDate endDate shift status publicationDays isType662");
};

const findDuplicatePublication = async (schoolId, grade, shift, startDate, endDate) => {
    dbg('[repo.findDuplicatePublication] window=', {
        schoolId, grade, shift,
        startISO: new Date(startDate).toISOString?.(),
        endISO: new Date(endDate).toISOString?.()
    });
    const dup = await Publication.findOne({
        schoolId: schoolId,
        grade: grade,
        shift: shift,
        status: { $in: ["OPEN", "FILLED"] },
        startDate: { $lte: endDate },
        endDate: { $gte: startDate }
    }).select("_id");
    dbg('[repo.findDuplicatePublication] found=', !!dup, 'id=', dup?._id?.toString?.());
    return dup;
};

const deletePublication = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`No existe ID: ${id}`);
    }
    const redisClient = connectToRedis();
    await redisClient.del("publications");
    return await Publication.deleteOne({ _id: id });
};

const deletePublicationsBySchoolId = async (schoolId) => {
    if (!mongoose.Types.ObjectId.isValid(schoolId)) {
        throw new Error(`Escuela con ID ${schoolId} inválido`);
    }
    const redisClient = connectToRedis();
    await redisClient.del("publications");
    await Publication.deleteMany({ schoolId });
};

const updatePublication = async (id, payload) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`No existe publicación con ID: ${id}`);
    }
    if (payload.schoolId && !mongoose.Types.ObjectId.isValid(payload.schoolId)) {
        throw new Error(`Escuela con ID ${payload.schoolId} inválido`);
    }
    dbg('[repo.updatePublication] id=', id, 'keys=', Object.keys(payload || {}));
    const publication = await Publication.findOne({ _id: id });

    if (publication) {
        Object.entries(payload).forEach(([key, value]) => {
            publication[key] = value;
        });

        const datesChanged = ("startDate" in payload) || ("endDate" in payload);
        const hasPrecomputedDays = Array.isArray(payload.publicationDays);

        // Solo regenerar si cambiaron fechas y NO vinieron días preconstruidos
        if (datesChanged && !hasPrecomputedDays) {
            const start = publication.startDate;
            const end = publication.endDate;
            publication.publicationDays = await generatePublicationDays(start, end);
        }

        await publication.save();
        dbg('[repo.updatePublication] saved id=', id, 'datesChanged=', datesChanged, 'days=', publication.publicationDays?.length);
    }
    const redisClient = connectToRedis();
    await redisClient.del("publications");
    return publication;
};

const isTeacherInPublicationDays = (publication, teacherId) => {
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        throw new Error(`ID de maestro inválido: ${teacherId}`);
    }

    return publication.publicationDays.some(day => day.assignedTeacherId?.toString() === teacherId.toString());
};

module.exports = {
    getPublications,
    findPublication,
    createPublication,
    deletePublication,
    updatePublication,
    findDuplicatePublication,
    getPublicationsBySchoolId,
    isTeacherInPublicationDays,
    deletePublicationsBySchoolId
};
