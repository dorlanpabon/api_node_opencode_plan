// Lógica de negocio de autenticación. Aislada del framework (patrón Service),
// fácil de probar sin HTTP y reutilizable desde otros módulos.
const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const { signToken } = require('../utils/jwt');

const SALT_ROUNDS = 10; // costo bcrypt recomendado (~100ms por hash)

/** Registro: crea el usuario con contraseña hasheada. Devuelve el perfil (sin hash). */
async function register({ username, password }) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await query(
    'INSERT INTO users (username, password_hash) VALUES (?, ?)',
    [username, passwordHash]
  );
  return { id: result.insertId, username };
}

/**
 * Hash dummy para comparar cuando el usuario no existe: iguala el tiempo de
 * respuesta y evita enumerar usuarios por diferencias de latencia.
 */
const DUMMY_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

/** Login: valida credenciales y devuelve { token, user } o null si son inválidas. */
async function login({ username, password }) {
  const [user] = await query(
    'SELECT id, username, password_hash FROM users WHERE username = ?',
    [username]
  );

  const passOk = await bcrypt.compare(password, user?.password_hash || DUMMY_HASH);

  if (!user || !passOk) return null;

  const token = signToken(user);
  return { token, user: { id: user.id, username: user.username } };
}

module.exports = { register, login };
