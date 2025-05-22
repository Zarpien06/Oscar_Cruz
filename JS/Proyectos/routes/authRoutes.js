// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const conexion = require('../db'); // Importa conexión a MySQL
const bcrypt = require('bcrypt');
const saltRounds = 10;

// 📥 Registro de usuario
router.post('/registro', async (req, res) => {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si ya existe el correo
        const query = 'SELECT * FROM usuarios WHERE correo = ?';
        conexion.query(query, [correo], async (err, results) => {
            if (results.length > 0) {
                return res.status(409).json({ error: 'Correo ya registrado' });
            }

            // Encriptar contraseña
            const hash = await bcrypt.hash(password, saltRounds);

            // Insertar nuevo usuario
            const insert = 'INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)';
            conexion.query(insert, [nombre, correo, hash], (err, result) => {
                if (err) return res.status(500).json({ error: 'Error al registrar usuario' });
                res.status(201).json({ mensaje: 'Usuario registrado exitosamente', id: result.insertId });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 🔐 Login
router.post('/login', (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ error: 'Correo y contraseña obligatorios' });
    }

    const query = 'SELECT * FROM usuarios WHERE correo = ?';
    conexion.query(query, [correo], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        const user = results[0];

        // Comparar contraseña
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        res.json({ mensaje: 'Login exitoso', usuario: { id: user.id, nombre: user.nombre, correo: user.correo } });
    });
});

module.exports = router;
