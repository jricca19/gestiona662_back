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
const { findPostulation } = require("../repositories/postulation.repository");

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

const getSchoolPublicationsController = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const { schoolId } = req.body;

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

const postPublicationController = async (req, res, next) => {
    try {
        const { schoolId, grade, startDate, endDate, shift } = req.body;
        const { _id } = req.user;

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
            startDate,
            endDate
        );
        if (duplicated) {
            return res.status(400).json({ message: "Ya existe una publicación abierta para esa escuela, grado, turno y rango de fechas.", });
        }

        await createPublication(schoolId, grade, startDate, endDate, shift);
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
    console.log("📩 Body recibido:", JSON.stringify(req.body, null, 2));
    const asignaciones = req.body.asignaciones;

    if (!Array.isArray(asignaciones) || asignaciones.length === 0) {
      return res.status(400).json({ message: "No se proporcionaron asignaciones válidas." });
    }

    const publicacionesMap = new Map(); // para no buscar la misma publicación varias veces

    for (const asignacion of asignaciones) {
      const { postulationId, selectedDays } = asignacion;

      const postulation = await findPostulation(postulationId);
      if (!postulation) {
        continue; // ignorar postulaciones inválidas
      }

      let publication = publicacionesMap.get(postulation.publicationId);
      if (!publication) {
        publication = await findPublication(postulation.publicationId);
        if (!publication) continue;
        publicacionesMap.set(postulation.publicationId, publication);
      }

      const teacherId = postulation.teacherId;

      // Convertir a fechas en formato YYYY-MM-DD
      const selectedDayStrings = selectedDays.map(d => new Date(d).toISOString().split("T")[0]);

      // Actualizar días de la publicación
      const updatedDays = publication.publicationDays.map(day => {
        const pubDayStr = new Date(day.date).toISOString().split("T")[0];
        if (selectedDayStrings.includes(pubDayStr)) {
          return {
            ...day,
            assignedTeacherId: teacherId,
            status: "ASSIGNED",
          };
        }
        return day;
      });

      // Guardar la publicación actualizada
      await updatePublication(publication._id, { publicationDays: updatedDays });
      
      // Actualizar también en memoria por si hay más asignaciones a la misma publicación
      publicacionesMap.set(publication._id.toString(), {
        ...publication,
        publicationDays: updatedDays,
      });
    }

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
        const publication = findPublication(publicationId);

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

        if (body.startDate && body.endDate & body.startDate > body.endDate) {
            return res.status(404).json({ message: `La fecha de fin debe ser mayor a la fecha de inicio`, });
        }

        const duplicated = await findDuplicatePublication(
            schoolId,
            grade,
            shift,
            startDate,
            endDate
        );
        if (duplicated) {
            return res.status(400).json({ message: "Ya existe una publicación abierta para esa escuela, grado, turno y rango de fechas.", });
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
    getSchoolPublicationsController,
    assignPostulationController,
    postPublicationController,
    putPublicationController,
    deletePublicationController,
};