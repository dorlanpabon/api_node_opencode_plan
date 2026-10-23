// Centraliza y expone la configuración desde variables de entorno (12-Factor App).
require('dotenv').config();

const required = (key, fallback) => {
  const value = process.env[key] ?? fallback;
  if (value === undefined || value === null || value === '') {
    throw new Error(`Falta la variable de entorno requerida: ${key}`);
  }
  return value;
};

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: required('DB_USER', 'root'),
    password: process.env.DB_PASSWORD || '',
    database: required('DB_NAME', 'api_auth_db'),
  },

  jwt: {
    // En producción el secreto es obligatorio y debe ser fuerte.
    secret: required('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },

  corsOrigin: process.env.CORS_ORIGIN || '*',
};

module.exports = env;
