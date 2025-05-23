const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Ruta raíz
app.get('/', (req, res) => {
    res.send('🚀 Bienvenido a FPC - Sistema de Gestión');
});

// Importar rutas
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// Ruta 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
