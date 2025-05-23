const db = require('../config/db'); // tu conexión a MySQL

module.exports = {
    create: (user, callback) => {
        const { nombre, email, password } = user;
        const sql = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
        db.query(sql, [nombre, email, password], callback);
    },

    findByEmail: (email, callback) => {
        const sql = 'SELECT * FROM usuarios WHERE email = ?';
        db.query(sql, [email], callback);
    },

    getAll: (callback) => {
        const sql = 'SELECT * FROM usuarios';
        db.query(sql, callback);
    },

    update: (id, data, callback) => {
        const { nombre, email } = data;
        const sql = 'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?';
        db.query(sql, [nombre, email, id], callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM usuarios WHERE id = ?';
        db.query(sql, [id], callback);
    }
};
