// Middleware de autenticación Bearer JWT: protege rutas privadas (útil para futuras rutas).
const { fail } = require('../utils/responses');
const { verifyToken } = require('../utils/jwt');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return fail(res, { status: 401, message: 'Token no proporcionado' });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return fail(res, { status: 401, message: 'Token inválido o expirado' });
  }
}

module.exports = requireAuth;
