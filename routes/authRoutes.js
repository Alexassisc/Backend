const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// ROTAS PÚBLICAS
router.post('/register', authController.register);
router.post('/login', authController.login);

// ROTAS PROTEGIDAS
router.use(authMiddleware);
router.get('/usuarios', authController.listUsers);
router.get('/usuarios/:id', authController.getUserById);
router.put('/usuarios/:id', authController.updateUser);
router.delete('/usuarios/:id', authController.deleteUser);

module.exports = router;
