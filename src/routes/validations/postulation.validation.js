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
    createdAt: Joi.date().required().messages({
        'date.base': 'La fecha de creación debe ser válida',
        'any.required': 'La fecha de creación es obligatoria'
    }),
    appliesToAllDays: Joi.boolean().required().messages({
        'boolean.base': 'El campo appliesToAllDays debe ser booleano',
        'any.required': 'El campo appliesToAllDays es obligatorio'
    }),
    postulationDays: Joi.when('appliesToAllDays', {
        is: false,
        then: Joi.array().items(postulationDaySchema).min(1).required()
            .messages({
                'array.base': 'postulationDays debe ser un arreglo de fechas',
                'array.min': 'Debe proporcionar al menos un día si no aplica a todos',
                'any.required': 'Debe proporcionar los días de postulación si no aplica a todos'
            }),
        otherwise: Joi.forbidden()
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
    }),
    appliesToAllDays: Joi.boolean().messages({
        'boolean.base': 'El campo appliesToAllDays debe ser booleano'
    }),
    createdAt: Joi.date().messages({
        'date.base': 'La fecha de creación debe ser válida'
    })
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

module.exports = {
    createPostulationSchema,
    updatePostulationSchema,
};