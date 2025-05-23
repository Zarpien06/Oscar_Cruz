const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/usuarios', authController.list);
router.put('/usuarios/:id', authController.update);
router.delete('/usuarios/:id', authController.delete);

module.exports = router;
