// index.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Rutas
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.send('🚀 Bienvenido a FPC - Sistema de Gestión');
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});



