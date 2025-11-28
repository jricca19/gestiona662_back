const {
    getPostulations,
    createPostulation,
    findPostulation,
    deletePostulation,
    updatePostulation,
    findDuplicatePostulation,
    getPostulationsByUserId,
} = require("../repositories/postulation.repository");
const { findPublication } = require("../repositories/publication.repository");
const { dateToIsoString } = require("../utils/dates");

const getPostulationsController = async (req, res, next) => {
    try {
        const postulations = await getPostulations();
        return res.status(200).json(postulations);
    } catch (error) {
        next(error);
    }
}

const getPostulationController = async (req, res, next) => {
    try {
        const postulationId = req.params.id;
        const postulation = await findPostulation(postulationId);
        if (postulation) {
            return res.status(200).json(postulation);
        }
        return res.status(404).json({ message: `No se ha encontrado la postulación con id: ${postulationId}` })
    } catch (error) {
        next(error);
    }
}

const getUserPostulationsOfUserController = async (req, res, next) => {
    try {
        const { _id } = req.user;

        const postulations = await getPostulationsByUserId(_id);
        return res.status(200).json(postulations);
    } catch (error) {
        next(error);
    }
};

const postPostulationController = async (req, res, next) => {
    try {
        const { publicationId } = req.body;
        const incomingPostulationDays = req.body.postulationDays || [];
        const { _id } = req.user;

        if (!publicationId || incomingPostulationDays.length === 0) {
            return res.status(400).json({ error: "No ha ingresado todos los datos requeridos." });
        }
        const publication = await findPublication(publicationId);
        if (!publication) {
            return res.status(404).json({ error: "La publicación no existe." });
        }
        const duplicated = await findDuplicatePostulation(_id, publicationId);

        if (duplicated) {
            return res.status(409).json({ error: "Ya existe una postulación registrada de ese maestro para esa publicación." });
        }

        const availableDays = (publication.publicationDays || [])
            .filter(d => d.status === "AVAILABLE")
            .map(d => dateToIsoString(d.date));

        if (availableDays.length === 0) {
            return res.status(400).json({ error: "La publicación no tiene días disponibles para postularse." });
        }

        let finalPostulationDays = incomingPostulationDays.map(pd => ({ date: dateToIsoString(pd.date) })) || [];

        const uniqueDates = new Set(finalPostulationDays.map(d => d.date));
        if (uniqueDates.size !== finalPostulationDays.length) {
            return res.status(400).json({ error: "No se permiten fechas duplicadas en la postulación." });
        }

        for (const pd of finalPostulationDays) {
            if (!availableDays.includes(pd.date)) {
                return res.status(400).json({ error: `La fecha ${pd.date} no es válida o no está disponible para esta publicación.` });
            }
        }

        const appliesToAllDays = finalPostulationDays.length === publication.publicationDays.length;

        await createPostulation(_id, publicationId, appliesToAllDays, finalPostulationDays);
        return res.status(201).json({ message: "Postulación creada correctamente" });

    } catch (error) {
        next(error);
    }
};

const deletePostulationController = async (req, res, next) => {
    try {
        const postulationId = req.params.id;
        const postulation = await findPostulation(postulationId);
        if (!postulation) {
            return res.status(404).json({ message: `No se ha encontrado la postulación con id: ${postulationId}` });
        }
        if (postulation.status !== "PENDING") {
            return res.status(400).json({ message: "Solo se pueden eliminar postulaciones con estado pendiente." });
        }
        await deletePostulation(postulationId);
        return res.status(200).json({ message: "Postulación eliminada correctamente" })
    } catch (error) {
        next(error);
    }
}

const putPostulationController = async (req, res, next) => {
    try {
        const postulationId = req.params.id;
        const { body } = req;
        let postulation = await findPostulation(postulationId);
        if (postulation) {
            postulation = await updatePostulation(postulationId, body);
            return res.status(200).json(postulation);
        }
        res.status(404).json({ message: `No se ha encontrado la postulación con id: ${postulationId}` });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getPostulationsController,
    getPostulationController,
    postPostulationController,
    putPostulationController,
    deletePostulationController,
    getUserPostulationsOfUserController,
}