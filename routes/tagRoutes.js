const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const authMiddleware = require('../middlewares/authMiddleware');

// Buscar o listar tags (Público / Capa 1+)
router.get('/', tagController.getTags);

// Crear tags (Requiere estar autenticado, Capa 1+)
router.post('/', authMiddleware(1), tagController.createTag);

module.exports = router;