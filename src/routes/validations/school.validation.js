const Joi = require("joi");

const schoolValidationSchema = Joi.object({
    schoolNumber: Joi.number().integer().min(1).required().messages({
        'number.base': 'El número de escuela debe ser un número entero',
        'number.min': 'El número de escuela debe ser mayor o igual a 1',
        'any.required': 'El número de escuela es obligatorio'
    }),
    departmentId: Joi.string().required().messages({
        'string.empty': 'El ID del departamento es obligatorio',
        'any.required': 'El ID del departamento es obligatorio'
    }),
    cityName: Joi.string().min(2).max(50).required().messages({
        'string.min': 'El nombre de la ciudad debe tener al menos 2 caracteres',
        'string.max': 'El nombre de la ciudad no puede tener más de 50 caracteres',
        'string.empty': 'El nombre de la ciudad es obligatorio',
        'any.required': 'El nombre de la ciudad es obligatorio'
    }),
    address: Joi.string().min(5).max(100).required().messages({
        'string.min': 'La dirección debe tener al menos 5 caracteres',
        'string.max': 'La dirección no puede tener más de 100 caracteres',
        'string.empty': 'La dirección es obligatoria',
        'any.required': 'La dirección es obligatoria'
    }),
});

const updateSchoolValidationSchema = Joi.object({
    schoolNumber: Joi.number().integer().min(1).optional().messages({
        'number.base': 'El número de escuela debe ser un número entero',
        'number.min': 'El número de escuela debe ser mayor o igual a 1',
    }),
    departmentId: Joi.string().optional().messages({
        'string.empty': 'El ID del departamento no puede estar vacío',
    }),
    cityName: Joi.string().min(2).max(50).optional().messages({
        'string.min': 'El nombre de la ciudad debe tener al menos 2 caracteres',
        'string.max': 'El nombre de la ciudad no puede tener más de 50 caracteres',
    }),
    address: Joi.string().min(5).max(100).optional().messages({
        'string.min': 'La dirección debe tener al menos 5 caracteres',
        'string.max': 'La dirección no puede tener más de 100 caracteres',
    }),
});

module.exports = {
    schoolValidationSchema,
    updateSchoolValidationSchema,
};