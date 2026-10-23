// Controlador HTTP: valida request, delega al service y arma la respuesta.
// No contiene lógica de negocio (separación de responsabilidades).
const { fail, ok } = require('../utils/responses');
const authService = require('../services/auth.service');

/** POST /api/auth/register → 201 con perfil público */
async function register(req, res, next) {
  try {
    const profile = await authService.register(req.body);
    return ok(res, { status: 201, message: 'Usuario registrado con éxito', data: profile });
  } catch (err) {
    next(err);
  }
}

/** POST /api/auth/login → 200 con token o 401 si las credenciales son inválidas */
async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    if (!result) {
      return fail(res, { status: 401, message: 'Credenciales inválidas' });
    }
    return ok(res, { message: 'Inicio de sesión exitoso', data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
