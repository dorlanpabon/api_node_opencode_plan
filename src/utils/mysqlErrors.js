// Mapa de errores de MySQL a mensajes entendibles.
// 1062: entrada duplicada | 1146: tabla no existe | 1091: columna no existe
const mysqlErrors = {
  1062: {
    status: 409,
    message: 'El usuario ya existe',
  },
  1146: {
    status: 500,
    message: 'La tabla users no existe en la base de datos',
  },
  1091: {
    status: 500,
    message: 'Error en la estructura de la tabla users',
  },
};

/** Traduce un error de MySQL a { status, message }; null si no aplica. */
function mapMySQLError(err) {
  const mapped = mysqlErrors[err?.errno];
  if (!mapped) return null;
  // Si el error de duplicado NO es por username, mensaje genérico.
  if (err.errno === 1062 && !String(err.sqlMessage || '').includes('username')) {
    return { status: 409, message: 'Registro duplicado' };
  }
  return mapped;
}

module.exports = mapMySQLError;
