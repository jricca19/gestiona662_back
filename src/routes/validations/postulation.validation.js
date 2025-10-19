const Joi = require("joi");

const postulationDaySchema = Joi.object({
    date: Joi.date().required().messages({
        'date.base': 'Cada día de postulación debe ser una fecha válida',
        'any.required': 'La fecha de postulación es obligatoria'
    })
});

const createPostulationSchema = Joi.object({
    publicationId: Joi.string().required().messages({
        'string.empty': 'El ID de la publicación es obligatorio',
        'any.required': 'El ID de la publicación es obligatorio'
    }),
    postulationDays: Joi.array()
        .items(postulationDaySchema)
        .min(1)
        .unique((a, b) => new Date(a.date).toISOString() === new Date(b.date).toISOString())
        .required()
        .messages({
        'array.base': 'postulationDays debe ser un arreglo de fechas',
        'array.min': 'Debe proporcionar al menos un día de postulación',
        'array.unique': 'Las fechas de postulación no deben repetirse',
        'any.required': 'Debe enviar al menos un día de postulación'
    })
});

const updatePostulationSchema = Joi.object({
    teacherId: Joi.string().messages({
        'string.empty': 'El ID del docente no debe estar vacío',
        'string.base': 'El ID del docente debe ser una cadena de texto'
    }),
    publicationId: Joi.string().messages({
        'string.empty': 'El ID de la publicación no debe estar vacío',
        'string.base': 'El ID de la publicación debe ser una cadena de texto'
    }),
    status: Joi.string().valid("PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN").messages({
        'any.only': 'El estado debe ser uno de: PENDING, ACCEPTED, REJECTED o WITHDRAWN',
        'string.base': 'El estado debe ser una cadena de texto'
    })
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

module.exports = {
    createPostulationSchema,
    updatePostulationSchema,
};