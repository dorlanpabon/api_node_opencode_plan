// Utilidades JWT: firma y verificación de access tokens.
const jwt = require('jsonwebtoken');
const env = require('../config/env');

/** Genera un access token corto en duración (payload mínimo). */
function signToken(user) {
  return jwt.sign(
    { sub: user.id, username: user.username },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );
}

/** Verifica el token; lanza error si es inválido o está expirado. */
function verifyToken(token) {
  return jwt.verify(token, env.jwt.secret);
}

module.exports = { signToken, verifyToken };
