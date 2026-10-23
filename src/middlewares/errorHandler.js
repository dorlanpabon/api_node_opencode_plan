// Manejo centralizado de errores: se registra la causa y se devuelve una
// respuesta sin filtrar detalles internos al cliente (buenas prácticas).
const env = require('../config/env');
const { fail } = require('../utils/responses');
const mapMySQLError = require('../utils/mysqlErrors');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  console.error(`[error] ${req.method} ${req.originalUrl}:`, err.message);
  if (env.nodeEnv !== 'production') console.error(err);

  const mapped = mapMySQLError(err);
  if (mapped) {
    return fail(res, { status: mapped.status, message: mapped.message });
  }

  if (err.code === 'EBADJSON' || err.type === 'entity.parse.failed') {
    return fail(res, { status: 400, message: 'JSON inválido en el cuerpo de la petición' });
  }

  return fail(res, { status: 500, message: 'Error interno del servidor' });
}

module.exports = errorHandler;
