const {
    getSchools,
    getSchoolByUserId,
    createSchool,
    findSchool,
    findSchoolById,
    deleteSchool,
    updateSchool,
    addUserToSchool,
} = require("../repositories/school.repository");
const { deleteRatingsBySchoolId } = require("../repositories/rating.repository");
const { deletePublicationsBySchoolId, getPublicationsBySchoolId } = require("../repositories/publication.repository");
const { addSchoolToUserProfile, removeSchoolFromUserProfiles } = require("../repositories/user.repository");
const { findDepartmentById, findCityByName } = require("../repositories/department.repository");

const getSchoolsController = async (req, res, next) => {
    try {
        const schools = await getSchools();
        return res.status(200).json(schools);
    } catch (error) {
        next(error);
    }
};

const getSchoolsOfUserController = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const schools = await getSchoolByUserId(_id);
        if (schools.length === 0) {
            return res.status(404).json({ message: `No se han encontrado escuelas para el usuario con id: ${_id}` });
        }
        return res.status(200).json(schools);
    } catch (error) {
        next(error);
    }
};


const getSchoolController = async (req, res, next) => {
    try {
        const schoolId = req.params.id;
        const school = await findSchoolById(schoolId);
        if (school) {
            return res.status(200).json(school);
        }
        return res.status(404).json({ message: `No se ha encontrado la escuela con id: ${schoolId}` });
    } catch (error) {
        next(error);
    }
};

const postSchoolController = async (req, res, next) => {
    try {
        const { schoolNumber, departmentId, cityName, address } = req.body;
        const { _id } = req.user;

        const department = await findDepartmentById(departmentId);
        if (!department) {
            return res.status(404).json({ message: `No se ha encontrado el departamento con id: ${departmentId}` });
        }

        const city = await findCityByName(departmentId, cityName);
        if (!city) {
            return res.status(404).json({ message: `No se ha encontrado la ciudad ${cityName} en el departamento ${department.name}` });
        }

        let school = await findSchool(schoolNumber, departmentId, cityName);
        if (school) {
            const userInSchool = school.staff?.some(staff => staff.userId.toString() === _id.toString());
            if (userInSchool) {
                return res.status(400).json({ message: `El usuario ya está registrado en la escuela ${schoolNumber} en ${cityName}` });
            }
            await addUserToSchool(_id, school, "SECONDARY");
            await addSchoolToUserProfile(_id, school._id);
            return res.status(200).json({ message: `Usuario agregado correctamente a la escuela existente. Debe ser aprobado por el director.` });
        }

        school = await createSchool(schoolNumber, departmentId, cityName, address);
        await addUserToSchool(_id, school, "PRIMARY");
        await addSchoolToUserProfile(_id, school._id);
        return res.status(201).json({ message: "Escuela creada correctamente y usuario agregado como principal." });
    } catch (error) {
        next(error);
    }
};

const putSchoolController = async (req, res, next) => {
    try {
        const schoolId = req.params.id;
        const { _id } = req.user;
        const { schoolNumber, departmentId, cityName, address } = req.body;

        const payload = {};
        if (schoolNumber !== undefined) payload.schoolNumber = schoolNumber;
        if (departmentId !== undefined) payload.departmentId = departmentId;
        if (cityName !== undefined) payload.cityName = cityName;
        if (address !== undefined) payload.address = address;

        if (!schoolId) {
            return res.status(400).json({ message: "El ID de la escuela es obligatorio." });
        }

        const school = await findSchoolById(schoolId);
        if (!school) {
            return res.status(404).json({ message: `No se ha encontrado la escuela con id: ${schoolId}` });
        }

        let department = null;
        let city = null;
        if (departmentId || cityName !== undefined) {
            if (departmentId) {
                department = await findDepartmentById(departmentId);
                if (!department) {
                    return res.status(404).json({ message: `No se ha encontrado el departamento con id: ${departmentId}` });
                }
            }

            const normalizedCityName = cityName && cityName.trim() !== "" ? cityName : school.cityName;

            city = await findCityByName(departmentId || school.departmentId, normalizedCityName);
            if (!city) {
                return res.status(404).json({ message: `No se ha encontrado la ciudad ${normalizedCityName} en el departamento especificado` });
            }
        }

        const isPrimary = school.staff?.some(staff => staff.userId.toString() === _id.toString() && staff.role === "PRIMARY");

        if (!isPrimary) {
            return res.status(403).json({ message: "No tienes permiso para modificar esta escuela." });
        }

        if (schoolNumber || departmentId || cityName !== undefined) {
            const normalizedCityName = cityName && cityName.trim() !== "" ? cityName.trim().toUpperCase() : school.cityName;
            const existingSchool = await findSchool(
                schoolNumber || school.schoolNumber,
                departmentId || school.departmentId,
                normalizedCityName
            );

            if (existingSchool && existingSchool._id.toString() !== schoolId) {
                return res.status(400).json({ message: "Ya existe una escuela con el mismo número, departamento y ciudad." });
            }
        }
        const updatedSchool = await updateSchool(school, payload);
        res.status(200).json(updatedSchool);
    } catch (error) {
        next(error);
    }
};

const deleteSchoolController = async (req, res, next) => {
    try {
        const schoolId = req.params.id;
        const { _id } = req.user;

        const school = await findSchoolById(schoolId);
        if (!school) {
            return res.status(404).json({ message: `No se ha encontrado la escuela con id: ${schoolId}` });
        }

        const isPrimary = school.staff?.some(staff => staff.userId.toString() === _id.toString() && staff.role === "PRIMARY");

        if (!isPrimary) {
            return res.status(403).json({ message: "No tienes permiso para eliminar esta escuela." });
        }

        const publications = await getPublicationsBySchoolId(schoolId);
        const hasActivePublications = publications.some(publication =>
            ["OPEN", "FILLED"].includes(publication.status) &&
            publication.publicationDays?.some(day => day.assignedTeacherId !== null)
        );

        if (hasActivePublications) {
            return res.status(400).json({ message: "No se puede eliminar la escuela porque tiene publicaciones activas con personas asignadas." });
        }

        await deletePublicationsBySchoolId(schoolId);
        await deleteRatingsBySchoolId(schoolId);
        await deleteSchool(schoolId);
        await removeSchoolFromUserProfiles(schoolId);

        return res.status(200).json({ message: "Escuela eliminada correctamente" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSchoolsController,
    getSchoolsOfUserController,
    getSchoolController,
    postSchoolController,
    putSchoolController,
    deleteSchoolController,
};