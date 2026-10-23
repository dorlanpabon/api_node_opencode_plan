// Middleware que consolida los errores de express-validator en una sola respuesta.
const { validationResult } = require('express-validator');
const { fail } = require('../utils/responses');

// Detiene la cadena si hay errores de validación; si no, pasa al siguiente handler.
function validateHandler(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return fail(res, {
      status: 422,
      message: 'Error de validación',
      errors: result.array().map(({ field, msg }) => ({ field, msg })),
    });
  }
  next();
}

module.exports = { validateHandler };
