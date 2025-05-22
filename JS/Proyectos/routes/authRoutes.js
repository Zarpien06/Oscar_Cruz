// routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Ruta de registro
router.get('/registro', (req, res) => {
    res.send('📝 Registrate Ahora');
});

// Ruta de login
router.get('/login', (req, res) => {
    res.send('🔐 Iniciar Sesión');
});

module.exports = router;
