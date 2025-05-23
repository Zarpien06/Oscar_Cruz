const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.register = (req, res) => {
  const { nombre, email, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.sendStatus(500);
    const newUser = { nombre, email, password: hash };
    User.create(newUser, (err) => {
      if (err) return res.sendStatus(500);
      res.json({ msg: "Usuario registrado" });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findByEmail(email, (err, results) => {
    if (err || results.length === 0) return res.sendStatus(401);
    const user = results[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (!match) return res.sendStatus(401);
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  });
};

exports.list = (req, res) => User.getAll((err, results) => {
  if (err) return res.sendStatus(500);
  res.json(results);
});

exports.update = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  User.update(id, data, (err) => {
    if (err) return res.sendStatus(500);
    res.json({ msg: "Actualizado" });
  });
};

exports.delete = (req, res) => {
  const { id } = req.params;
  User.delete(id, (err) => {
    if (err) return res.sendStatus(500);
    res.json({ msg: "Eliminado" });
  });
};
