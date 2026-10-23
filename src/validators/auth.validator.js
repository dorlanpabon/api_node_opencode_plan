// Reglas de validación para las rutas de autenticación, con express-validator.
const { body } = require('express-validator');

const registerRules = [
  body('username')
    .trim()
    .notEmpty().withMessage('El usuario es obligatorio')
    .isLength({ min: 3, max: 50 }).withMessage('El usuario debe tener entre 3 y 50 caracteres')
    .isAlphanumeric('es-ES', { ignore: '._-' }).withMessage('El usuario solo admite letras, números, punto, guion y guion bajo'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8, max: 100 }).withMessage('La contraseña debe tener entre 8 y 100 caracteres'),
];

// En login solo se valida presencia y tipo; no se revelan las reglas de las credenciales.
const loginRules = [
  body('username').trim().notEmpty().withMessage('El usuario es obligatorio'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

module.exports = { registerRules, loginRules };
