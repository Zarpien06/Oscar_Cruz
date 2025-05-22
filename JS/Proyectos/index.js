// index.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

require('./db'); // Importa y ejecuta la conexión

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/api', authRoutes);
app.use('/api', userRoutes);

// Ruta raíz
app.get('/', (req, res) => {
    res.send('🚀 Bienvenido a FPC - Sistema de Gestión');
});

// Ruta 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Error general
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});
