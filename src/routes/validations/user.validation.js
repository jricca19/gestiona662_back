const Joi = require("joi");

const signupValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede tener más de 20 caracteres',
    'string.empty': 'El nombre es obligatorio',
    'any.required': 'El nombre es obligatorio'
  }),
  lastName: Joi.string().min(3).max(20).required().messages({
    'string.min': 'El apellido debe tener al menos 3 caracteres',
    'string.max': 'El apellido no puede tener más de 20 caracteres',
    'string.empty': 'El apellido es obligatorio',
    'any.required': 'El apellido es obligatorio'
  }),
  ci: Joi.string().required().messages({
    'string.empty': 'El CI es obligatorio',
    'any.required': 'El CI es obligatorio'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'El correo electrónico no es válido',
    'string.empty': 'El correo electrónico es obligatorio',
    'any.required': 'El correo electrónico es obligatorio'
  }),
  password: Joi.string().min(8).max(20).required().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'string.max': 'La contraseña no puede tener más de 20 caracteres',
    'string.empty': 'La contraseña es obligatoria',
    'any.required': 'La contraseña es obligatoria'
  }),
  phoneNumber: Joi.string().required().messages({
    'string.empty': 'El número de teléfono es obligatorio',
    'any.required': 'El número de teléfono es obligatorio'
  }),
  role: Joi.string().valid("TEACHER", "STAFF").required().messages({
    'any.only': 'El rol debe ser TEACHER o STAFF',
    'string.empty': 'El rol es obligatorio',
    'any.required': 'El rol es obligatorio'
  }),
  schoolId: Joi.string()
  .when('role', {
    is: 'STAFF',
    then: Joi.string().required().messages({
      'string.empty': 'El ID de la escuela es obligatorio para usuarios STAFF',
      'any.required': 'El ID de la escuela es obligatorio para usuarios STAFF'
    }),
    otherwise: Joi.forbidden() // evita que TEACHER mande schoolId
  })
});

const updateUserValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional().messages({
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede tener más de 20 caracteres',
  }),
  lastName: Joi.string().min(3).max(20).optional().messages({
    'string.min': 'El apellido debe tener al menos 3 caracteres',
    'string.max': 'El apellido no puede tener más de 20 caracteres',
  }),
  ci: Joi.string().optional().messages({
    'string.empty': 'El CI no puede estar vacío',
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'El correo electrónico no es válido',
  }),
  phoneNumber: Joi.string().optional().messages({
    'string.empty': 'El número de teléfono no puede estar vacío',
  }),
  profilePhoto: Joi.string().optional().messages({
    'string.empty': 'La url de la foto de perfil no puede estar vacía',
  }),
});

const loginValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'El correo electrónico no es válido',
    'string.empty': 'El correo electrónico es obligatorio',
    'any.required': 'El correo electrónico es obligatorio'
  }),
  password: Joi.string().min(8).max(20).required().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'string.max': 'La contraseña no puede tener más de 20 caracteres',
    'string.empty': 'La contraseña es obligatoria',
    'any.required': 'La contraseña es obligatoria'
  }),
});

const updateTeacherValidationSchema = Joi.object({
  isEffectiveTeacher: Joi.boolean().optional().messages({
    'boolean.base': 'El valor de isEffectiveTeacher debe ser verdadero o falso',
  }),
  address: Joi.string().optional().messages({
    'string.empty': 'La dirección no puede estar vacía',
  }),
  graduationDate: Joi.date().optional().messages({
    'date.base': 'La fecha de graduación debe ser válida',
  }),
  competitionNumber: Joi.number().optional().messages({
    'number.base': 'El número de competencia debe ser un número',
  }),
  healthCertificateStatus: Joi.boolean().optional().messages({
    'boolean.base': 'El estado del certificado de salud debe ser verdadero o falso',
  }),
  criminalRecordDate: Joi.date().optional().messages({
    'date.base': 'La fecha del certificado de antecedentes penales debe ser válida',
  }),
  law19889CertificateDate: Joi.date().optional().messages({
    'date.base': 'La fecha del certificado de la Ley 19889 debe ser válida',
  }),
  gradeExperience: Joi.array().items(Joi.number().integer().min(0).max(6)).optional().messages({
    'array.base': 'La experiencia por grado debe ser una lista de números',
    'number.min': 'La experiencia por grado no puede ser menor a 0',
    'number.max': 'La experiencia por grado no puede ser mayor a 6',
  }),
  preferredShifts: Joi.array().items(Joi.string().valid("MORNING", "AFTERNOON", "FULL_DAY")).optional().messages({
    'array.base': 'Los turnos preferidos deben ser una lista de valores válidos',
    'any.only': 'Los turnos preferidos deben ser MORNING, AFTERNOON o FULL_DAY',
  }),
});



module.exports = {
  signupValidationSchema,
  updateUserValidationSchema,
  loginValidationSchema,
  updateTeacherValidationSchema,
};
