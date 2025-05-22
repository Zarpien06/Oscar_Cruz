// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const conexion = require('../db'); // Conexión a base de datos desde archivo separado (ver paso 2)

// 🔍 Obtener todos los usuarios
router.get('/usuarios', (req, res) => {
    const sql = 'SELECT * FROM usuarios';
    conexion.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
        res.json(results);
    });
});

// 🔍 Obtener un usuario por ID
router.get('/usuarios/:id', (req, res) => {
    const sql = 'SELECT * FROM usuarios WHERE id = ?';
    conexion.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al buscar el usuario' });
        if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(results[0]);
    });
});

// ➕ Crear nuevo usuario
router.post('/usuarios', (req, res) => {
    const { nombre, correo, password } = req.body;
    const sql = 'INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)';
    conexion.query(sql, [nombre, correo, password], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al crear usuario' });
        res.json({ mensaje: 'Usuario creado', id: result.insertId });
    });
});

// ✏️ Actualizar usuario
router.put('/usuarios/:id', (req, res) => {
    const { nombre, correo, password } = req.body;
    const sql = 'UPDATE usuarios SET nombre = ?, correo = ?, password = ? WHERE id = ?';
    conexion.query(sql, [nombre, correo, password, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar usuario' });
        res.json({ mensaje: 'Usuario actualizado' });
    });
});

// ❌ Eliminar usuario
router.delete('/usuarios/:id', (req, res) => {
    const sql = 'DELETE FROM usuarios WHERE id = ?';
    conexion.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar usuario' });
        res.json({ mensaje: 'Usuario eliminado' });
    });
});

module.exports = router;
