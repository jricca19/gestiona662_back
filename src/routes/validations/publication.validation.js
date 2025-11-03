const Joi = require("joi");

const createPublicationSchema = Joi.object({
    schoolId: Joi.string().required().messages({
        "string.base": "El ID de la escuela debe ser una cadena de texto.",
        "any.required": "El ID de la escuela es obligatorio."
    }),
    grade: Joi.number().min(0).max(6).required().messages({
        "number.base": "El grado debe ser un número.",
        "number.min": "El grado no puede ser menor que 0.",
        "number.max": "El grado no puede ser mayor que 6.",
        "any.required": "El grado es obligatorio."
    }),
    startDate: Joi.date().required().messages({
        "date.base": "La fecha de inicio debe ser una fecha válida.",
        "any.required": "La fecha de inicio es obligatoria."
    }),
    endDate: Joi.date().min(Joi.ref("startDate")).required().messages({
        "date.base": "La fecha de fin debe ser una fecha válida.",
        "date.min": "La fecha de fin debe ser mayor o igual a la fecha de inicio.",
        "any.required": "La fecha de fin es obligatoria."
    }),
    shift: Joi.string().valid("MORNING", "AFTERNOON", "FULL_DAY").required().messages({
        "string.base": "El turno debe ser una cadena de texto.",
        "any.only": "El turno debe ser 'MORNING', 'AFTERNOON' o 'FULL_DAY'.",
        "any.required": "El turno es obligatorio."
    }),
    details: Joi.string().optional().messages({
        "string.base": "Los detalles deben ser una cadena de texto."
    }),
    isType662: Joi.boolean().optional().messages({
        "boolean.base": "isType662 debe ser un valor booleano."
    }),
});

const updatePublicationSchema = Joi.object({
    schoolId: Joi.string().messages({
        "string.base": "El ID de la escuela debe ser una cadena de texto."
    }),
    grade: Joi.number().min(0).max(6).messages({
        "number.base": "El grado debe ser un número.",
        "number.min": "El grado no puede ser menor que 0.",
        "number.max": "El grado no puede ser mayor que 6."
    }),
    startDate: Joi.date().required().messages({
        "date.base": "La fecha de inicio debe ser una fecha válida.",
        "any.required": "La fecha de inicio es obligatoria."
    }),
    endDate: Joi.date()
        .when("startDate", {
            is: Joi.exist(),
            then: Joi.date().min(Joi.ref("startDate")),
            otherwise: Joi.date()
        })
        .required()
        .messages({
            "date.base": "La fecha de fin debe ser una fecha válida.",
            "date.min": "La fecha de fin debe ser mayor o igual a la fecha de inicio.",
            "any.required": "La fecha de fin es obligatoria."
        }),
    shift: Joi.string().valid("MORNING", "AFTERNOON", "FULL_DAY").messages({
        "string.base": "El turno debe ser una cadena de texto.",
        "any.only": "El turno debe ser 'MORNING', 'AFTERNOON' o 'FULL_DAY'."
    }),
    details: Joi.string().optional().messages({
        "string.base": "Los detalles deben ser una cadena de texto."
    }),
    isType662: Joi.boolean().required().messages({
        "boolean.base": "isType662 debe ser un valor booleano.",
        "any.required": "isType662 es obligatorio."
    }),
}).min(1).messages({
    "object.min": "Debe proporcionar al menos un campo para actualizar."
});

module.exports = {
    createPublicationSchema,
    updatePublicationSchema
};