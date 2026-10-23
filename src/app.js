// Configuración de la aplicación Express: middlewares transversales, rutas y
// manejo de errores. No arranca el servidor (eso lo hace server.js).
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { ok, fail } = require('./utils/responses');
const env = require('./config/env');

const app = express();

// Seguridad: cabeceras HTTP y CORS configurables
app.use(helmet());
app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(',') }));

// Parseo de JSON y logs HTTP en desarrollo
app.use(express.json());
if (env.nodeEnv === 'development') app.use(morgan('dev'));

// Health-check: verificar que la API está viva (útil en despliegues)
app.get('/health', (_req, res) => ok(res, { message: 'API funcionando correctamente' }));

// Rutas de la API montadas bajo /api
app.use('/api', routes);

// Ruta no encontrada
app.use((_req, res) => fail(res, { status: 404, message: 'Ruta no encontrada' }));

// Manejador de errores (siempre el último)
app.use(errorHandler);

module.exports = app;
