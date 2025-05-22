// db.js
const mysql = require('mysql');

const conexion = mysql.createConnection({
    host: 'localhost',
    database: 'prueba',
    user: 'root',
    password: ''
});

conexion.connect(error => {
    if (error) throw error;
    console.log('📦 Conectado a la base de datos MySQL');
});

module.exports = conexion;
