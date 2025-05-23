const db = require('../config/db');

const User = {
  findByEmail: (email, callback) => {
    db.query("SELECT * FROM usuarios WHERE email = ?", [email], callback);
  },
  create: (user, callback) => {
    db.query("INSERT INTO usuarios SET ?", user, callback);
  },
  getAll: (callback) => {
    db.query("SELECT * FROM usuarios", callback);
  },
  update: (id, user, callback) => {
    db.query("UPDATE usuarios SET ? WHERE id = ?", [user, id], callback);
  },
  delete: (id, callback) => {
    db.query("DELETE FROM usuarios WHERE id = ?", [id], callback);
  }
};

module.exports = User;
