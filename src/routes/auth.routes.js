// Definición de rutas de autenticación: orden middleware chain → controller.
const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { registerRules, loginRules } = require('../validators/auth.validator');
const { validateHandler } = require('../middlewares/validate');

const router = Router();

router.post('/register', registerRules, validateHandler, authController.register);
router.post('/login', loginRules, validateHandler, authController.login);

module.exports = router;
