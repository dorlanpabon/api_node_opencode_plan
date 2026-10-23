// Enrutador raíz: agrega todos los módulos de rutas bajo /api.
const { Router } = require('express');
const authRoutes = require('./auth.routes');

const router = Router();

router.use('/auth', authRoutes);

module.exports = router;
