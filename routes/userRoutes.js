const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// 1. Rutas específicas / estáticas (Van PRIMERO)
router.get('/me', authMiddleware(1), userController.getProfile);
router.get('/me/posts', authMiddleware(1), userController.getMyPosts);

// 2. Rutas dinámicas por ID o actualización (Van DESPUÉS)
router.put('/me', authMiddleware(1), userController.updateProfile);
// router.get('/:id', authMiddleware(1), userController.getUserById); // Si existe más adelante

module.exports = router;