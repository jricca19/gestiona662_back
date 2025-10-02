const Joi = require("joi");

const ratingValidationSchema = Joi.object({
    publicationId: Joi.string().required().messages({
        'string.empty': 'El ID de la publicación es obligatorio',
        'any.required': 'El ID de la publicación es obligatorio',
    }),
    teacherId: Joi.string().optional().messages({
        'string.empty': 'El ID del maestro no puede estar vacío',
    }),
    score: Joi.number().min(1).max(10).required().messages({
        'number.min': 'La puntuación debe ser al menos 1',
        'number.max': 'La puntuación no puede ser mayor a 10',
        'number.base': 'La puntuación debe ser un número',
        'any.required': 'La puntuación es obligatoria',
    }),
    comment: Joi.string().required().messages({
        'string.empty': 'El comentario es obligatorio',
        'any.required': 'El comentario es obligatorio',
    }),
});

const ratingsValidationSchema = Joi.object({
    teacherId: Joi.string().optional().messages({
        'string.empty': 'El ID del maestro no puede estar vacío',
    }),
    schoolId: Joi.string().optional().messages({
        'string.empty': 'El ID de la escuela no puede estar vacío',
    }),
}).xor('teacherId', 'schoolId').messages({
    'object.missing': 'Debe proporcionar al menos teacherId o schoolId.',
});

module.exports = {
    ratingValidationSchema,
    ratingsValidationSchema,
};